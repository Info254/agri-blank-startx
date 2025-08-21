import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/useUser';

const FarmerContractNetworks: React.FC = () => {
  const { user } = useUser();
  const [networks, setNetworks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inputTerms, setInputTerms] = useState('');
  const [mentorshipTerms, setMentorshipTerms] = useState('');
  const [bargainingTerms, setBargainingTerms] = useState('');
  const [members, setMembers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [invites, setInvites] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    fetchNetworks();
  }, []);

  async function fetchNetworks() {
    const { data } = await supabase
      .from('farmer_contract_networks')
      .select('*')
      .eq('lead_farmer_id', user?.id);
    setNetworks(data || []);
  }

  async function createNetwork() {
    const { data, error } = await supabase.from('farmer_contract_networks').insert([
      {
        lead_farmer_id: user.id,
        contract_title: title,
        description,
        input_purchasing_terms: inputTerms,
        mentorship_terms: mentorshipTerms,
        bargaining_terms: bargainingTerms,
      },
    ]).select();
    if (!error && data) {
      setNetworks([...networks, ...data]);
      setTitle(''); setDescription(''); setInputTerms(''); setMentorshipTerms(''); setBargainingTerms('');
    }
  }

  async function fetchMembers(networkId) {
    const { data } = await supabase
      .from('farmer_contract_members')
      .select('*, profiles:farmer_id(email, full_name)')
      .eq('contract_network_id', networkId);
    setMembers(data || []);
  }

  async function fetchSessions(networkId) {
    const { data } = await supabase
      .from('mentorship_sessions')
      .select('*')
      .eq('contract_network_id', networkId);
    setSessions(data || []);
  }

  async function fetchInvites(networkId) {
    const { data } = await supabase
      .from('invitations')
      .select('*')
      .eq('contract_network_id', networkId);
    setInvites(data || []);
  }

  async function inviteFarmer(networkId) {
    // This is a placeholder. In a real app, you'd look up the user by email and add them.
    alert('Invite sent to ' + inviteEmail);
    setInviteEmail('');
  }

  return (
    <div className="min-h-screen">
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Farmer Contract Networks</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Lead farmers can create networks, invite smaller farmers, and set fair contract terms.
        </p>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Contract Network</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="mb-2" />
            <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="mb-2" />
            <Textarea placeholder="Input Purchasing Terms" value={inputTerms} onChange={e => setInputTerms(e.target.value)} className="mb-2" />
            <Textarea placeholder="Mentorship Terms" value={mentorshipTerms} onChange={e => setMentorshipTerms(e.target.value)} className="mb-2" />
            <Textarea placeholder="Bargaining Terms" value={bargainingTerms} onChange={e => setBargainingTerms(e.target.value)} className="mb-2" />
            <Button onClick={createNetwork}>Create Network</Button>
          </CardContent>
        </Card>
        <div className="grid gap-6">
          {networks.map(network => (
            <Card key={network.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{network.contract_title}</CardTitle>
                <div className="text-muted-foreground">{network.description}</div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 font-semibold">Input Purchasing Terms:</div>
                <div className="mb-2">{network.input_purchasing_terms}</div>
                <div className="mb-2 font-semibold">Mentorship Terms:</div>
                <div className="mb-2">{network.mentorship_terms}</div>
                <div className="mb-2 font-semibold">Bargaining Terms:</div>
                <div className="mb-2">{network.bargaining_terms}</div>
                <Button onClick={() => { setSelectedNetwork(network); fetchMembers(network.id); fetchSessions(network.id); fetchInvites(network.id); }}>
                  View Members
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {selectedNetwork && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Members of {selectedNetwork.contract_title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {members.map(member => (
                  <li key={member.id} className="mb-2">
                    {member.profiles?.full_name || member.profiles?.email || member.farmer_id}
                  </li>
                ))}
              </ul>
              {sessions.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Mentorship Sessions</h4>
                  <ul>
                    {sessions.map(s => (
                      <li key={s.id} className="mb-1">
                        {s.session_date}: {s.topic} (Mentor: {s.mentor_id}, Mentee: {s.mentee_id})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {invites.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Invitations</h4>
                  <ul>
                    {invites.map(i => (
                      <li key={i.id} className="mb-1">
                        {i.invited_email} - {i.status}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Input placeholder="Invite farmer by email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="mb-2" />
              <Button onClick={() => inviteFarmer(selectedNetwork.id)}>Invite</Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default FarmerContractNetworks; 