import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface BidValidationRules {
  minimumBidAmount: number;
  maximumBidAmount: number;
  bidIncrement: number;
  allowAutoBidding: boolean;
  maxBidsPerUser: number;
  requiredUserVerification: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class BidValidator {
  private rules: BidValidationRules;
  private supabase;

  constructor(rules: BidValidationRules, supabase: any) {
    this.rules = rules;
    this.supabase = supabase;
  }

  async validateBid(bid: {
    auction_id: string;
    bidder_user_id: string;
    bid_amount: number;
  }): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check bid amount constraints
    if (bid.bid_amount < this.rules.minimumBidAmount) {
      errors.push(`Bid must be at least ${this.rules.minimumBidAmount}`);
    }
    if (bid.bid_amount > this.rules.maximumBidAmount) {
      errors.push(`Bid cannot exceed ${this.rules.maximumBidAmount}`);
    }

    // Check bid increment
    const { data: lastBid } = await this.supabase
      .from('city_market_bids')
      .select('bid_amount')
      .eq('auction_id', bid.auction_id)
      .order('bid_time', { ascending: false })
      .limit(1);

    if (lastBid?.length && bid.bid_amount - lastBid[0].bid_amount < this.rules.bidIncrement) {
      errors.push(`Bid increment must be at least ${this.rules.bidIncrement}`);
    }

    // Check user bid limit
    const { data: userBids } = await this.supabase
      .from('city_market_bids')
      .select('id')
      .eq('auction_id', bid.auction_id)
      .eq('bidder_user_id', bid.bidder_user_id);

    if (userBids && userBids.length >= this.rules.maxBidsPerUser) {
      errors.push(`Maximum ${this.rules.maxBidsPerUser} bids allowed per user`);
    }

    // Check user verification if required
    if (this.rules.requiredUserVerification) {
      const { data: user } = await this.supabase
        .from('profiles')
        .select('is_verified')
        .eq('id', bid.bidder_user_id)
        .single();

      if (!user?.is_verified) {
        errors.push('User must be verified to place bids');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Additional validation methods
  async validateAuctionStatus(auctionId: string): Promise<ValidationResult> {
    const errors: string[] = [];

    const { data: auction } = await this.supabase
      .from('city_market_auctions')
      .select('status, auction_end')
      .eq('id', auctionId)
      .single();

    if (!auction) {
      errors.push('Auction not found');
      return { isValid: false, errors };
    }

    if (auction.status !== 'active') {
      errors.push('Auction is not active');
    }

    if (new Date(auction.auction_end) < new Date()) {
      errors.push('Auction has ended');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async validateUserEligibility(userId: string): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check user account status
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('is_active, is_banned')
      .eq('id', userId)
      .single();

    if (!profile?.is_active || profile?.is_banned) {
      errors.push('User account is not eligible to place bids');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
