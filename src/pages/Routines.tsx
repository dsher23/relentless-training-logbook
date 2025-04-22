
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import WeeklyRoutineBuilder from "@/components/WeeklyRoutineBuilder";
import { useAppContext } from "@/context/AppContext";
import TrainingBlockForm from "@/components/TrainingBlockForm";
import { format, addWeeks, isBefore } from "date-fns";

const Routines: React.FC = () => {
  const navigate = useNavigate();
  const { 
    workoutTemplates, 
    weakPoints, 
    weeklyRoutines, 
    trainingBlocks,
    checkTrainingBlockStatus,
    getStagnantExercises
  } = useAppContext();
  
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [showTrainingBlockDialog, setShowTrainingBlockDialog] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  const { needsUpdate, trainingBlock } = checkTrainingBlockStatus();
  const stagnantExercises = getStagnantExercises();

  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const activeTrainingBlocks = trainingBlocks
    .filter(block => {
      const endDate = addWeeks(new Date(block.startDate), block.durationWeeks);
      return isBefore(today, endDate);
    })
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  
  const handleEditTemplate = (id: string) => {
    setSelectedTemplateId(id);
    setShowTemplateBuilder(true);
  };

  return (
    <div className="app-container animate-fade-in">
      <Header title="Training Routines" />
      
      {(needsUpdate && trainingBlock) && (
        <div className="px-4 mb-6">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="font-medium">Training Block Completed</h3>
                  <p className="text-sm text-muted-foreground">
                    Your "{trainingBlock.name}" training block has ended. Time to create a new one!
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowTrainingBlockDialog(true)}
                  >
                    Create New Training Block
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {stagnantExercises.length > 0 && (
        <div className="px-4 mb-6">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Stagnation Warning</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    These exercises haven't shown progress in 3+ sessions:
                  </p>
                  <ul className="text-sm list-disc pl-5 space-y-1">
                    {stagnantExercises.slice(0, 3).map((item, i) => (
                      <li key={i}>
                        {item.exercise.name} ({item.workout.name})
                      </li>
                    ))}
                    {stagnantExercises.length > 3 && (
                      <li>+{stagnantExercises.length - 3} more</li>
                    )}
                  </ul>
                  <p className="text-xs mt-2 text-muted-foreground">
                    Consider changing rep ranges or switching to variations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Tabs defaultValue="templates" className="px-4">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="routines">Training Blocks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Workout Templates</h2>
            <Button
              size="sm"
              onClick={() => {
                setSelectedTemplateId(null);
                setShowTemplateBuilder(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> New Template
            </Button>
          </div>
          
          {workoutTemplates.length === 0 ? (
            <Card className="mb-4">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium mb-1">No Templates Yet</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Create workout templates to build your weekly training routine
                </p>
                <Button 
                  onClick={() => {
                    setSelectedTemplateId(null);
                    setShowTemplateBuilder(true);
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" /> Create First Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {workoutTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2 bg-secondary flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-medium">
                        {template.name}
                        {template.dayName && <span className="ml-2 text-sm text-muted-foreground">({template.dayName})</span>}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-2">Exercises:</h4>
                      <ul className="space-y-1">
                        {template.exercises.slice(0, 5).map((exercise) => (
                          <li key={exercise.id} className="text-sm flex items-center">
                            <span className="w-2 h-2 bg-iron-blue rounded-full mr-2"></span>
                            {exercise.name}
                            {exercise.isWeakPoint && (
                              <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                                Weak Point
                              </span>
                            )}
                          </li>
                        ))}
                        {template.exercises.length > 5 && (
                          <li className="text-sm text-muted-foreground">
                            + {template.exercises.length - 5} more
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditTemplate(template.id)}
                      >
                        Edit Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="routines" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Training Blocks</h2>
            <Button
              size="sm"
              onClick={() => setShowTrainingBlockDialog(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> New Block
            </Button>
          </div>
          
          {activeTrainingBlocks.length === 0 ? (
            <Card className="mb-4">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium mb-1">No Active Training Blocks</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Create a training block to organize your weekly workout routine
                </p>
                <Button onClick={() => setShowTrainingBlockDialog(true)}>
                  <Plus className="mr-1 h-4 w-4" /> Create Training Block
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeTrainingBlocks.map((block) => {
                const routine = weeklyRoutines.find(r => r.id === block.weeklyRoutineId);
                const endDate = addWeeks(new Date(block.startDate), block.durationWeeks);
                const remainingWeeks = Math.ceil((endDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000));
                
                return (
                  <Card key={block.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2 bg-secondary flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-medium">
                          {block.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <h4 className="text-xs text-muted-foreground">Start Date</h4>
                          <p className="text-sm">{format(new Date(block.startDate), "MMM d, yyyy")}</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-muted-foreground">End Date</h4>
                          <p className="text-sm">{format(endDate, "MMM d, yyyy")}</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-muted-foreground">Duration</h4>
                          <p className="text-sm">{block.durationWeeks} weeks</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-muted-foreground">Remaining</h4>
                          <p className="text-sm">{remainingWeeks} {remainingWeeks === 1 ? 'week' : 'weeks'}</p>
                        </div>
                      </div>
                      
                      {routine && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-2">Weekly Schedule:</h4>
                          {routine.workoutDays
                            .filter(day => day.workoutTemplateId)
                            .map((day) => {
                              const template = workoutTemplates.find(t => t.id === day.workoutTemplateId);
                              return template ? (
                                <div key={day.dayOfWeek} className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium w-16">{dayNames[day.dayOfWeek]}:</span>
                                  <span className="text-sm">{template.name}</span>
                                </div>
                              ) : null;
                            })}
                        </div>
                      )}
                      
                      {block.notes && (
                        <div className="mb-3">
                          <h4 className="text-xs text-muted-foreground mb-1">Notes</h4>
                          <p className="text-sm">{block.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {/* Edit training block */}}
                        >
                          Edit Block
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Template Builder Dialog */}
      <Dialog open={showTemplateBuilder} onOpenChange={setShowTemplateBuilder}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplateId ? "Edit Workout Template" : "Create Workout Template"}
            </DialogTitle>
          </DialogHeader>
          <WeeklyRoutineBuilder 
            templateId={selectedTemplateId || undefined}
            onSave={() => setShowTemplateBuilder(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Training Block Dialog */}
      <Dialog open={showTrainingBlockDialog} onOpenChange={setShowTrainingBlockDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Training Block</DialogTitle>
          </DialogHeader>
          <TrainingBlockForm onSave={() => setShowTrainingBlockDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Routines;
