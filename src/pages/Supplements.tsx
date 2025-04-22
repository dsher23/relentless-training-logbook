
import React from "react";
import { format } from "date-fns";
import { PillIcon, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import SupplementItem from "@/components/SupplementItem";
import { useAppContext } from "@/context/AppContext";

const Supplements: React.FC = () => {
  const { supplements, supplementLogs } = useAppContext();
  const today = new Date();
  
  // Get today's logs
  const todayString = format(today, 'yyyy-MM-dd');
  const todayLogs = supplementLogs.filter(log => 
    format(new Date(log.date), 'yyyy-MM-dd') === todayString
  );
  
  // Calculate compliance for today
  const takenCount = todayLogs.filter(log => log.taken).length;
  const complianceRate = supplements.length > 0 
    ? Math.round((takenCount / supplements.length) * 100)
    : 0;
  
  return (
    <div className="app-container animate-fade-in">
      <Header title="Supplements" />
      
      <div className="px-4 mb-6">
        <Button
          className="w-full bg-gym-purple text-white hover:bg-gym-darkPurple"
          onClick={() => {}}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Supplement
        </Button>
      </div>
      
      {supplements.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <PillIcon className="h-12 w-12 text-gym-purple mb-4" />
          <h2 className="text-xl font-bold mb-2">No Supplements Added</h2>
          <p className="text-muted-foreground mb-6">
            Start tracking your supplements to monitor intake and set reminders.
          </p>
        </div>
      ) : (
        <>
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
              <TabsTrigger value="all" className="flex-1">All Supplements</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
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
                          {supplement.schedule?.workoutDays ? " · Workout days" : ""}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="text-center py-6 text-muted-foreground">
                Supplement history will be available in the next version
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Supplements;
