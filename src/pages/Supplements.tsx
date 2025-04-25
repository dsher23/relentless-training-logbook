import React, { useState } from "react";
import { format } from "date-fns";
import { PillIcon, Plus, Lock, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import SupplementItem from "@/components/SupplementItem";
import AddSupplementForm from "@/components/AddSupplementForm";
import AddCycleForm from "@/components/AddCycleForm";
import AddCompoundForm from "@/components/AddCompoundForm";
import { useAppContext } from "@/context/AppContext";
import { SteroidCompound } from "@/types";
import TabNavigation from "@/components/TabNavigation";

const Supplements: React.FC = () => {
  const { 
    supplements, 
    supplementLogs, 
    steroidCycles, 
    steroidCompounds, 
    addCompound, 
    updateCompound, 
    deleteCompound 
  } = useAppContext();
  
  const [isSupplementFormOpen, setIsSupplementFormOpen] = useState(false);
  const [isCycleFormOpen, setIsCycleFormOpen] = useState(false);
  const [isCompoundFormOpen, setIsCompoundFormOpen] = useState(false);
  const [currentCycleId, setCurrentCycleId] = useState<string | null>(null);
  const [editingCompound, setEditingCompound] = useState<SteroidCompound | null>(null);
  
  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');
  const todayLogs = supplementLogs.filter(log => 
    format(new Date(log.date), 'yyyy-MM-dd') === todayString
  );
  
  const takenCount = todayLogs.filter(log => log.taken).length;
  const complianceRate = supplements.length > 0 
    ? Math.round((takenCount / supplements.length) * 100)
    : 0;
  
  const handleAddCompound = (cycleId: string) => {
    setCurrentCycleId(cycleId);
    setEditingCompound(null);
    setIsCompoundFormOpen(true);
  };
  
  const handleEditCompound = (compound: SteroidCompound) => {
    setEditingCompound(compound);
    setCurrentCycleId(compound.cycleId);
    setIsCompoundFormOpen(true);
  };
  
  const handleSaveCompound = (compound: SteroidCompound) => {
    if (editingCompound) {
      updateCompound(compound);
    } else {
      addCompound({
        ...compound,
        cycleId: currentCycleId!
      });
    }
    setIsCompoundFormOpen(false);
  };
  
  const handleDeleteCompound = (compoundId: string) => {
    if (confirm("Are you sure you want to delete this compound?")) {
      deleteCompound(compoundId);
    }
  };
  
  const cycleCompounds = (cycleId: string) => {
    return steroidCompounds.filter(c => c.cycleId === cycleId);
  };
  
  return (
    <div className="app-container animate-fade-in pb-16">
      <Header title="Supplements + Cycles" />
      
      <div className="px-4 space-y-3 mb-6">
        <Button
          className="w-full bg-gym-purple text-white hover:bg-gym-darkPurple"
          onClick={() => setIsSupplementFormOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Supplement
        </Button>
        
        <Button
          variant="outline"
          className="w-full border-gym-purple text-gym-purple hover:bg-gym-purple hover:text-white"
          onClick={() => setIsCycleFormOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Steroid Cycle
        </Button>
      </div>
      
      <div className="px-4 mb-6">
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Today's Compliance</span>
              <span className="text-lg font-bold">{complianceRate}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-gym-purple h-2.5 rounded-full" 
                style={{ width: `${complianceRate}%` }}
              ></div>
            </div>
            <div className="text-xs text-muted-foreground mt-2 text-center">
              {takenCount} of {supplements.length} supplements taken today
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="today" className="w-full px-4">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
          <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
          <TabsTrigger value="cycles" className="flex-1">Cycles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today">
          {supplements.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No supplements added yet. Click "Add New Supplement" to get started.
            </div>
          ) : (
            <div className="bg-white rounded-md shadow-sm overflow-hidden">
              {supplements.map(supplement => {
                const log = todayLogs.find(log => log.supplementId === supplement.id);
                return (
                  <SupplementItem
                    key={supplement.id}
                    supplement={supplement}
                    log={log}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all">
          {supplements.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No supplements added yet. Click "Add New Supplement" to get started.
            </div>
          ) : (
            <div className="bg-white rounded-md shadow-sm overflow-hidden">
              {supplements.map(supplement => (
                <div key={supplement.id} className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-secondary text-gym-purple mr-3">
                      <PillIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">{supplement.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {supplement.dosage}
                        {supplement.schedule?.times && supplement.schedule.times.length > 0 && 
                          ` · ${supplement.schedule.times.join(", ")}`}
                      </p>
                      {supplement.notes && (
                        <p className="text-xs text-muted-foreground italic mt-1">{supplement.notes}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="cycles">
          <div className="space-y-4">
            {steroidCycles.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No cycles added yet. Click "Add Steroid Cycle" to get started.
              </div>
            ) : (
              steroidCycles.map(cycle => (
                <Card key={cycle.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{cycle.name}</h3>
                        {cycle.isPrivate && <Lock className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Week {cycle.currentWeek || 1} of {cycle.totalWeeks || 12}
                      </span>
                    </div>
                    
                    {cycle.notes && (
                      <p className="text-sm text-muted-foreground mb-4">{cycle.notes}</p>
                    )}
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Compounds</h4>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAddCompound(cycle.id)}
                        >
                          <Plus className="mr-1 h-4 w-4" /> Add Compound
                        </Button>
                      </div>
                      
                      {cycleCompounds(cycle.id).length === 0 ? (
                        <div className="text-center py-3 text-sm border rounded-md border-dashed">
                          No compounds added to this cycle
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {cycleCompounds(cycle.id).map(compound => (
                            <div 
                              key={compound.id} 
                              className="flex justify-between items-start p-3 bg-secondary/50 rounded-md"
                            >
                              <div>
                                <div className="flex items-center">
                                  <span className="text-sm font-medium">🧪 {compound.name}</span>
                                  {!compound.active && (
                                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                                      Ended
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {compound.weeklyDosage}{compound.dosageUnit}/week – {compound.frequency}
                                  {compound.duration && ` – ${compound.duration} weeks`}
                                </div>
                                {compound.notes && (
                                  <div className="text-xs italic text-muted-foreground mt-1">
                                    {compound.notes}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleEditCompound(compound)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-red-500"
                                  onClick={() => handleDeleteCompound(compound.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <AddSupplementForm open={isSupplementFormOpen} onOpenChange={setIsSupplementFormOpen} />
      <AddCycleForm open={isCycleFormOpen} onOpenChange={setIsCycleFormOpen} />
      <AddCompoundForm 
        open={isCompoundFormOpen} 
        onOpenChange={setIsCompoundFormOpen}
        onSave={handleSaveCompound}
        initialCompound={editingCompound || undefined}
        cycleId={currentCycleId || undefined}
      />
      <TabNavigation />
    </div>
  );
};

export default Supplements;
