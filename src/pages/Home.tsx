
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Dumbbell, LineChart, LayoutDashboard } from 'lucide-react';
import Logo from '@/components/Logo';

const Home: React.FC = () => {
  return (
    <div className="app-container animate-fade-in">
      <Header title="Home" />
      
      <div className="p-4">
        <div className="grid gap-4">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Welcome to Your Fitness Journey</h2>
              <p className="text-muted-foreground mb-4">
                Track your workouts, monitor progress, and reach your fitness goals.
              </p>
              <div className="flex flex-col space-y-2">
                <Link to="/dashboard">
                  <Button className="w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Button>
                </Link>
                <Link to="/training">
                  <Button className="w-full" variant="outline">
                    <Dumbbell className="mr-2 h-4 w-4" /> Training Hub
                  </Button>
                </Link>
                <Link to="/plans">
                  <Button className="w-full" variant="outline">
                    <CalendarDays className="mr-2 h-4 w-4" /> Workout Plans
                  </Button>
                </Link>
                <Link to="/routines">
                  <Button className="w-full" variant="outline">
                    <LineChart className="mr-2 h-4 w-4" /> Routines
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
