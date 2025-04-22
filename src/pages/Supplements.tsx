import React, { useState } from "react";
import { format } from "date-fns";
import { PillIcon, Plus, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import SupplementItem from "@/components/SupplementItem";
import AddSupplementForm from "@/components/AddSupplementForm";
import AddCycleForm from "@/components/AddCycleForm";
import { useAppContext } from "@/context/AppContext";

const Supplements: React.FC = () => {
  const { supplements, supplementLogs, steroidCycles } = useAppContext();
  const [isSupplementFormOpen, setIsSupplementFormOpen] = useState(false);
  const [isCycleFormOpen, setIsCycleFormOpen] = useState(false);
  
  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');
  const todayLogs = supplementLogs.filter(log => 
    format(new Date(log.date), 'yyyy-MM-dd') === todayString
  );
  
  const takenCount = todayLogs.filter(log => log.taken).length;
  const complianceRate = supplements.length > 0 
    ? Math.round((takenCount / supplements.length) * 100)
    : 0;
  
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
        </TabsContent>
        
        <TabsContent value="all">
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
                      {supplement.schedule?.times && ` · ${supplement.schedule.times.join(", ")}`}
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
        </TabsContent>
        
        <TabsContent value="cycles">
          <div className="space-y-4">
            {steroidCycles.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No cycles added yet
              </div>
            ) : (
              steroidCycles.map(cycle => (
                <Card key={cycle.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{cycle.name}</h3>
                        {cycle.isPrivate && <Lock className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Week {cycle.currentWeek} of {cycle.totalWeeks}
                      </span>
                    </div>
                    {cycle.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{cycle.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <AddSupplementForm open={isSupplementFormOpen} onOpenChange={setIsSupplementFormOpen} />
      <AddCycleForm open={isCycleFormOpen} onOpenChange={setIsCycleFormOpen} />
    </div>
  );
};

export default Supplements;
