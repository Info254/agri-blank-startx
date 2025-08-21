import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Download, Upload, Plus } from 'lucide-react';
import ReportGenerator from './ReportGenerator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const FinancialManagement: React.FC = () => {
  const { user } = useAuth();
  const [farmStats, setFarmStats] = useState<any>(null);
  const [marketForecasts, setMarketForecasts] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgetForm, setBudgetForm] = useState({
    year: new Date().getFullYear(),
    category: '',
    subcategory: '',
    planned_amount: '',
    actual_amount: '',
    notes: '',
  });
  const [addingBudget, setAddingBudget] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchData = async () => {
      // Farm statistics
      const { data: stats } = await supabase
        .from('farm_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setFarmStats(stats);
      // Market forecasts
      const { data: forecasts } = await supabase
        .from('market_forecasts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      setMarketForecasts(forecasts || []);
      // Budgets
      const { data: budgetRows } = await supabase
        .from('farm_budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('year', { ascending: false });
      setBudgets(budgetRows || []);
      // Transactions
      const { data: txs } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      setTransactions(txs || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleBudgetFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBudgetForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingBudget(true);
    await supabase.from('farm_budgets').insert({
      user_id: user.id,
      year: Number(budgetForm.year),
      category: budgetForm.category,
      subcategory: budgetForm.subcategory,
      planned_amount: Number(budgetForm.planned_amount),
      actual_amount: budgetForm.actual_amount ? Number(budgetForm.actual_amount) : null,
      notes: budgetForm.notes,
    });
    setBudgetForm({
      year: new Date().getFullYear(),
      category: '',
      subcategory: '',
      planned_amount: '',
      actual_amount: '',
      notes: '',
    });
    setAddingBudget(false);
    // Refresh budgets
    const { data: budgetRows } = await supabase
      .from('farm_budgets')
      .select('*')
      .eq('user_id', user.id)
      .order('year', { ascending: false });
    setBudgets(budgetRows || []);
  };

  const handleEditClick = (budget: any) => {
    setEditingBudget(budget);
    setEditForm({ ...budget });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('farm_budgets').update({
      year: Number(editForm.year),
      category: editForm.category,
      subcategory: editForm.subcategory,
      planned_amount: Number(editForm.planned_amount),
      actual_amount: editForm.actual_amount ? Number(editForm.actual_amount) : null,
      notes: editForm.notes,
      updated_at: new Date().toISOString(),
    }).eq('id', editingBudget.id);
    setEditingBudget(null);
    setEditForm(null);
    // Refresh budgets
    const { data: budgetRows } = await supabase
      .from('farm_budgets')
      .select('*')
      .eq('user_id', user.id)
      .order('year', { ascending: false });
    setBudgets(budgetRows || []);
  };

  const handleDeleteBudget = async (id: string) => {
    setDeletingId(id);
    await supabase.from('farm_budgets').delete().eq('id', id);
    setDeletingId(null);
    // Refresh budgets
    const { data: budgetRows } = await supabase
      .from('farm_budgets')
      .select('*')
      .eq('user_id', user.id)
      .order('year', { ascending: false });
    setBudgets(budgetRows || []);
  };

  // Calculate totals for summary cards
  const totalRevenue = farmStats?.monthly_revenue || 0;
  const totalExpenses = budgets.reduce((sum, b) => sum + (b.actual_amount < 0 ? Math.abs(b.actual_amount) : 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Financial Management</h2>
          <p className="text-muted-foreground">Track your farm revenue, expenses, and profitability</p>
        </div>
        <ReportGenerator />
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-600">KES {totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +6.5%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-sm text-muted-foreground">Total Outgoing</p>
                <p className="text-2xl font-bold text-red-600">KES {totalExpenses.toLocaleString()}</p>
                <p className="text-xs text-red-600 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  +2.1%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profit</p>
                <p className="text-sm text-muted-foreground">Revenue - Expenses</p>
                <p className="text-2xl font-bold text-green-600">KES {netProfit.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.3%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  {farmStats ? (
                    <>
                      <div>
                        <div>Monthly Revenue: <b>KES {farmStats.monthly_revenue?.toLocaleString() || 0}</b></div>
                        <div>Average Yield: <b>{farmStats.average_yield || 0} tons</b></div>
                        <div>Total Area: <b>{farmStats.total_area || 0} acres</b></div>
                        <div>Active Alerts: <b>{farmStats.active_alerts || 0}</b></div>
                      </div>
                    </>
                  ) : (
                    'Loading...'
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.length > 0 ? transactions.slice(0, 5).map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{transaction.payment_provider || transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{new Date(transaction.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}KES {Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </div>
                  )) : <div className="text-muted-foreground">No transactions found.</div>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                {transactions.length > 0 ? (
                  <ul className="w-full">
                    {transactions.filter((t: any) => t.amount > 0).map((t: any) => (
                      <li key={t.id} className="flex justify-between border-b py-2">
                        <span>{t.payment_provider || t.description}</span>
                        <span className="text-green-600 font-bold">+KES {t.amount.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : 'No revenue transactions.'}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                {transactions.length > 0 ? (
                  <ul className="w-full">
                    {transactions.filter((t: any) => t.amount < 0).map((t: any) => (
                      <li key={t.id} className="flex justify-between border-b py-2">
                        <span>{t.payment_provider || t.description}</span>
                        <span className="text-red-600 font-bold">-KES {Math.abs(t.amount).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : 'No expense transactions.'}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasts">
          <Card>
            <CardHeader>
              <CardTitle>Financial Forecasts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-y-auto">
                {marketForecasts.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">Commodity</th>
                        <th className="text-left">County</th>
                        <th className="text-left">Forecast Price</th>
                        <th className="text-left">Confidence</th>
                        <th className="text-left">Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketForecasts.map((f) => (
                        <tr key={f.id}>
                          <td>{f.commodity_name}</td>
                          <td>{f.county}</td>
                          <td>KES {f.forecast_price?.toLocaleString()}</td>
                          <td>{f.confidence_level}</td>
                          <td>{f.period}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <div className="text-muted-foreground">No forecasts found.</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <form onSubmit={handleAddBudget} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                  <div>
                    <Input name="year" type="number" min="2020" max="2100" value={budgetForm.year} onChange={handleBudgetFormChange} placeholder="Year" required />
                  </div>
                  <div>
                    <Input name="category" value={budgetForm.category} onChange={handleBudgetFormChange} placeholder="Category (e.g. Seeds)" required />
                  </div>
                  <div>
                    <Input name="subcategory" value={budgetForm.subcategory} onChange={handleBudgetFormChange} placeholder="Subcategory (e.g. Maize seed)" />
                  </div>
                  <div>
                    <Input name="planned_amount" type="number" value={budgetForm.planned_amount} onChange={handleBudgetFormChange} placeholder="Planned Amount" required />
                  </div>
                  <div>
                    <Input name="actual_amount" type="number" value={budgetForm.actual_amount} onChange={handleBudgetFormChange} placeholder="Actual Amount" />
                  </div>
                  <div>
                    <Button type="submit" disabled={addingBudget}>{addingBudget ? 'Adding...' : 'Add Budget Item'}</Button>
                  </div>
                  <div className="md:col-span-6">
                    <Textarea name="notes" value={budgetForm.notes} onChange={handleBudgetFormChange} placeholder="Notes" />
                  </div>
                </form>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Category</th>
                      <th>Subcategory</th>
                      <th>Planned</th>
                      <th>Actual</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgets.length > 0 ? budgets.map((b) => (
                      <tr key={b.id}>
                        <td>{b.year}</td>
                        <td>{b.category}</td>
                        <td>{b.subcategory}</td>
                        <td>KES {b.planned_amount?.toLocaleString()}</td>
                        <td>{b.actual_amount !== null ? `KES ${b.actual_amount.toLocaleString()}` : '-'}</td>
                        <td>{b.notes}</td>
                        <td>
                          <Button size="sm" variant="outline" onClick={() => handleEditClick(b)} className="mr-2">Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteBudget(b.id)} disabled={deletingId === b.id}>Delete</Button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={7} className="text-center text-muted-foreground">No budget items found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {editingBudget && (
        <Dialog open={!!editingBudget} onOpenChange={() => setEditingBudget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Budget Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateBudget} className="space-y-2">
              <Input name="year" type="number" min="2020" max="2100" value={editForm.year} onChange={handleEditFormChange} required />
              <Input name="category" value={editForm.category} onChange={handleEditFormChange} required />
              <Input name="subcategory" value={editForm.subcategory} onChange={handleEditFormChange} />
              <Input name="planned_amount" type="number" value={editForm.planned_amount} onChange={handleEditFormChange} required />
              <Input name="actual_amount" type="number" value={editForm.actual_amount || ''} onChange={handleEditFormChange} />
              <Textarea name="notes" value={editForm.notes} onChange={handleEditFormChange} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingBudget(null)}>Cancel</Button>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FinancialManagement;
