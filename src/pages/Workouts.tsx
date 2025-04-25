import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/AppContext";
import { format } from "date-fns";
import { Plus, Calendar, Dumbbell, MoreVertical, Copy, Trash2, Star, Clock } from "lucide-react";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkoutTemplate } from "@/types";
import { toast } from "sonner";

const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, workoutTemplates, deleteWorkoutTemplate } = useAppContext();
  const [showDialog, setShowDialog] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const activeWorkouts = workouts.filter(w => !w.completed);
  const completedWorkouts = workouts.filter(w => w.completed);
  const favoriteTemplates = workoutTemplates.filter(t => t.isFavorite);

  const handleCreateWorkout = () => {
    if (newWorkoutName.trim()) {
      navigate(`/workouts/builder/new?name=${encodeURIComponent(newWorkoutName)}`);
      setShowDialog(false);
      setNewWorkoutName("");
    }
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplateToDelete(id);
    setConfirmDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (templateToDelete && deleteWorkoutTemplate) {
      deleteWorkoutTemplate(templateToDelete);
      toast.success("Template deleted successfully");
      setConfirmDeleteDialog(false);
      setTemplateToDelete(null);
    }
  };

  return (
    <div className="app-container animate-fade-in pb-16">
      <Header title="Workouts" />

      <div className="px-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Workout Management</h2>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Workout
          </Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeWorkouts.length > 0 ? (
              <div className="space-y-4">
                {activeWorkouts.map((workout) => (
                  <Card key={workout.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => navigate(`/workouts/${workout.id}`)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{workout.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {workout.date &&
                                format(new Date(workout.date), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge variant={workout.completed ? "outline" : "default"}>
                            {workout.completed ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {workout.exercises?.length || 0} exercises
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No active workouts</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a new workout to get started
                </p>
                <Button
                  onClick={() => setShowDialog(true)}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Workout
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Favorite Templates</h3>
              {favoriteTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteTemplates.map((template) => (
                    <Card key={template.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium flex items-center">
                              {template.name}
                              <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {template.exercises.length} exercises
                            </p>
                          </div>
                          <div className="flex">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/workouts/start/${template.id}?isTemplate=true`)
                              }
                            >
                              Start
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => navigate(`/workouts/${template.id}`)}
                                >
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => navigate(`/workouts/builder/${template.id}`)}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteTemplate(template.id)}
                                  className="text-red-500"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No favorite templates yet
                </p>
              )}
            </div>

            <h3 className="text-sm font-medium mb-2">All Templates</h3>
            {workoutTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workoutTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {template.exercises.length} exercises
                          </p>
                        </div>
                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/workouts/start/${template.id}?isTemplate=true`)
                            }
                          >
                            Start
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => navigate(`/workouts/${template.id}`)}
                              >
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => navigate(`/workouts/builder/${template.id}`)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="text-red-500"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No templates</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create workout templates to reuse later
                </p>
                <Button
                  onClick={() => navigate("/workouts/template/new")}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Template
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {completedWorkouts.length > 0 ? (
              <div className="space-y-4">
                {completedWorkouts
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((workout) => (
                    <Card key={workout.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() => navigate(`/workouts/${workout.id}`)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{workout.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {workout.date &&
                                  format(new Date(workout.date), "MMM d, yyyy")}
                              </p>
                            </div>
                            <Badge variant="outline">Completed</Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            {workout.exercises?.length || 0} exercises
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No workout history</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete workouts to see them here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* New Workout Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workout</DialogTitle>
            <DialogDescription>
              Give your workout a name to get started
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                placeholder="e.g., Upper Body Day"
                value={newWorkoutName}
                onChange={(e) => setNewWorkoutName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkout}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialog} onOpenChange={setConfirmDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Workouts;
