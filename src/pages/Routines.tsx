import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useAppContext } from "@/context/AppContext";
import DataExport from "@/components/DataExport";
import { CalendarDays, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { WeeklyRoutine, WorkoutDay } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const Routines: React.FC = () => {
  const { weeklyRoutines, addWeeklyRoutine, updateWeeklyRoutine, deleteWeeklyRoutine, duplicateWeeklyRoutine, archiveWeeklyRoutine, addRoutine } = useAppContext();
  const [open, setOpen] = React.useState(false);
  const [editRoutineId, setEditRoutineId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState<string | null>(null);
  
  const handleRoutineSave = () => {
    setEditRoutineId(null);
  };

  const handleArchiveRoutine = (id: string, archived: boolean) => {
    archiveWeeklyRoutine(id, archived);
  };
  
  const promptDeleteRoutine = (id: string) => {
    setRoutineToDelete(id);
    setConfirmDeleteDialog(true);
  };
  
  const confirmDeleteRoutine = () => {
    if (!routineToDelete) return;
    
    deleteWeeklyRoutine(routineToDelete);
    setConfirmDeleteDialog(false);
    setRoutineToDelete(null);
  };

  const handleCreateRoutine = () => {
    addRoutine({
      name: "New Routine",
      workoutDays: [],
      days: {},
      workouts: [],
      archived: false,
      startDate: "",
      endDate: ""
    });
  };

  return (
    <div className="app-container animate-fade-in pb-16">
      <Header title="Weekly Routines" />
      
      <div className="px-4 mt-4">
        <Card className="bg-secondary/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/60">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Weekly Routines</h3>
                <p className="text-sm text-muted-foreground">
                  Create structured weekly training schedules to organize your workouts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="routines" className="w-full">
          <TabsList>
            <TabsTrigger value="routines">Routines</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          <TabsContent value="routines" className="space-y-6 mt-4">
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
            
            {weeklyRoutines.filter(routine => showArchived ? true : !routine.archived).length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <div className="flex flex-col items-center justify-center p-6">
                    <div className="rounded-full bg-secondary p-3 mb-4">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Weekly Routines</h3>
                    <p className="text-muted-foreground mb-4 max-w-sm">
                      Create weekly training routines to organize your workout days
                    </p>
                    <Button onClick={() => setOpen(true)}>
                      Create Weekly Routine
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {weeklyRoutines
                  .filter(routine => showArchived ? true : !routine.archived)
                  .map((routine) => (
                    <Card key={routine.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-lg">{routine.name}</h3>
                          <div className="flex">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setEditRoutineId(routine.id)}
                              className="h-8 w-8"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => duplicateWeeklyRoutine(routine.id)}>
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleArchiveRoutine(routine.id, !routine.archived)}>
                                  {routine.archived ? "Unarchive" : "Archive"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:bg-destructive/20"
                                  onClick={() => promptDeleteRoutine(routine.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {routine.workoutDays.length} workout{routine.workoutDays.length !== 1 ? 's' : ''} per week
                        </p>
                        <div className="text-xs text-muted-foreground mt-2">
                          <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                            {routine.workoutDays.map((day: WorkoutDay) => (
                              <li key={day.id}>
                                • {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.dayOfWeek]}: {day.workoutName || 'Rest'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="mt-4">
              <WeeklyRoutineBuilder 
                onSave={() => {}} 
                onCancel={() => {}} 
              />
            </div>
          </TabsContent>
          <TabsContent value="export">
            <DataExport />
          </TabsContent>
        </Tabs>
        
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-50 overflow-y-auto ${open ? '' : 'hidden'}`}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-2xl mx-auto w-full">
              <h2 className="text-lg font-medium mb-4">Create Weekly Routine</h2>
              <WeeklyRoutineBuilder 
                onSave={() => { setOpen(false); handleRoutineSave(); }} 
                onCancel={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
        
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-50 overflow-y-auto ${editRoutineId ? '' : 'hidden'}`}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-2xl mx-auto w-full">
              {editRoutineId && (
                <>
                  <h2 className="text-lg font-medium mb-4">Edit Weekly Routine</h2>
                  <WeeklyRoutineBuilder 
                    templateId={editRoutineId} 
                    onSave={() => { setEditRoutineId(null); handleRoutineSave(); }}
                    onCancel={() => setEditRoutineId(null)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        
        <Dialog open={confirmDeleteDialog} onOpenChange={setConfirmDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Weekly Routine</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this weekly routine? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteRoutine}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Routines;
