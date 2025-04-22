import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import WeeklyRoutineBuilder from "@/components/WeeklyRoutineBuilder";
import { useAppContext, WeeklyRoutine, TrainingBlock } from "@/context/AppContext";
import TrainingBlockForm from "@/components/TrainingBlockForm";
import { format, addWeeks, isBefore } from "date-fns";
import DataExport from "@/components/DataExport";
import { Plus } from "lucide-react";

const Routines: React.FC = () => {
  const { weeklyRoutines, addWeeklyRoutine, updateWeeklyRoutine, deleteWeeklyRoutine, duplicateWeeklyRoutine, archiveWeeklyRoutine, trainingBlocks, addTrainingBlock, updateTrainingBlock, deleteTrainingBlock, checkTrainingBlockStatus } = useAppContext();
  const [open, setOpen] = React.useState(false);
  const [editRoutineId, setEditRoutineId] = useState<string | null>(null);
  const [isCreatingBlock, setIsCreatingBlock] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TrainingBlock | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  
  const { needsUpdate, trainingBlock } = checkTrainingBlockStatus();
  
  const handleRoutineSave = () => {
    setEditRoutineId(null);
  };
  
  const handleCreateBlock = () => {
    setIsCreatingBlock(true);
  };
  
  const handleEditBlock = () => {
    if (trainingBlock) {
      setEditingBlock(trainingBlock);
    }
  };
  
  const handleBlockClose = () => {
    setIsCreatingBlock(false);
    setEditingBlock(null);
  };
  
  const handleDeleteBlock = (id: string) => {
    deleteTrainingBlock(id);
    handleBlockClose();
  };
  
  const handleArchiveRoutine = (id: string, archived: boolean) => {
    archiveWeeklyRoutine(id, archived);
  };
  
  const getNextBlockStartDate = (): Date => {
    if (!trainingBlock) {
      return new Date();
    }
    
    const endDate = addWeeks(new Date(trainingBlock.startDate), trainingBlock.durationWeeks);
    
    if (isBefore(endDate, new Date())) {
      return new Date();
    }
    
    return endDate;
  };

  return (
    <div className="app-container animate-fade-in">
      <Header title="Routines" />
      
      <div className="px-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Training Block</CardTitle>
          </CardHeader>
          <CardContent>
            {trainingBlock ? (
              <div className="space-y-2">
                <p>
                  Current Block: <strong>{trainingBlock.name}</strong>
                </p>
                <p>
                  Start Date:{" "}
                  {format(new Date(trainingBlock.startDate), "MMM dd, yyyy")}
                </p>
                <p>
                  Duration: {trainingBlock.durationWeeks} weeks
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleEditBlock}>
                    Edit Block
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => trainingBlock.id ? handleDeleteBlock(trainingBlock.id) : null}
                  >
                    Delete Block
                  </Button>
                </div>
                {needsUpdate && (
                  <div className="mt-4 text-yellow-500">
                    <p>
                      Your current training block has ended. Please create a new
                      one.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p>No active training block.</p>
                <Button size="sm" onClick={handleCreateBlock}>
                  Create Training Block
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Tabs defaultValue="routines" className="w-full mt-4">
          <TabsList>
            <TabsTrigger value="routines">Routines</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          <TabsContent value="routines" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Weekly Routines</h2>
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="show-archived"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show Archived
                </label>
                <input
                  type="checkbox"
                  id="show-archived"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                />
                <Button size="sm" onClick={() => setOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Routine
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {weeklyRoutines
                .filter(routine => showArchived ? true : !routine.archived)
                .map((routine) => (
                  <Card key={routine.id}>
                    <CardHeader>
                      <CardTitle>{routine.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {routine.workoutDays.length} workouts per week
                      </p>
                      <div className="flex justify-end space-x-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M3 12h18" />
                                <path d="M3 6h18" />
                                <path d="M3 18h18" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setEditRoutineId(routine.id)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => duplicateWeeklyRoutine(routine.id)}>
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleArchiveRoutine(routine.id, !routine.archived)}>
                              {routine.archived ? "Unarchive" : "Archive"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/20"
                              onClick={() => deleteWeeklyRoutine(routine.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="templates">
            <WeeklyRoutineBuilder />
          </TabsContent>
          <TabsContent value="export">
            <DataExport />
          </TabsContent>
        </Tabs>
        
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-50 overflow-y-auto ${open ? '' : 'hidden'}`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg max-w-2xl mx-auto">
              <h2 className="text-lg font-medium mb-4">Create Weekly Routine</h2>
              <WeeklyRoutineBuilder onSave={() => { setOpen(false); handleRoutineSave(); }} />
              <div className="flex justify-end mt-4">
                <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-50 overflow-y-auto ${editRoutineId ? '' : 'hidden'}`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg max-w-2xl mx-auto">
              {editRoutineId && (
                <>
                  <h2 className="text-lg font-medium mb-4">Edit Weekly Routine</h2>
                  <WeeklyRoutineBuilder templateId={editRoutineId} onSave={() => { setEditRoutineId(null); handleRoutineSave(); }} />
                  <div className="flex justify-end mt-4">
                    <Button variant="secondary" onClick={() => setEditRoutineId(null)}>Cancel</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-50 overflow-y-auto ${isCreatingBlock || editingBlock ? '' : 'hidden'}`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg max-w-2xl mx-auto">
              <TrainingBlockForm 
                blockId={editingBlock?.id}
                nextSuggestedDate={getNextBlockStartDate()}
                onClose={handleBlockClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routines;
