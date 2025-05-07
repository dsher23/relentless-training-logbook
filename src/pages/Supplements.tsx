import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Supplement, SteroidCycle } from '@/types';
import { db } from '@/firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useUser } from '@/hooks/useUser';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import AddSupplementForm from '@/components/AddSupplementForm';
import AddCycleForm from '@/components/AddCycleForm';
import NavigationHeader from '@/components/NavigationHeader';

const Supplements: React.FC = () => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [cycles, setCycles] = useState<SteroidCycle[]>([]);
  const [addSupplementOpen, setAddSupplementOpen] = useState(false);
  const [addCycleOpen, setAddCycleOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchSupplements = async () => {
      if (user) {
        const supplementsCollection = collection(db, `users/${user.uid}/supplements`);
        const supplementsSnapshot = await getDocs(supplementsCollection);
        const supplementsList = supplementsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Supplement[];
        setSupplements(supplementsList);
      }
    };

    const fetchCycles = async () => {
      if (user) {
        const cyclesCollection = collection(db, `users/${user.uid}/cycles`);
        const cyclesSnapshot = await getDocs(cyclesCollection);
        const cyclesList = cyclesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SteroidCycle[];
        setCycles(cyclesList);
      }
    };

    fetchSupplements();
    fetchCycles();
  }, [user]);

  const handleAddSupplement = async (supplement: Omit<Supplement, 'id'>) => {
    if (user) {
      try {
        const supplementsCollection = collection(db, `users/${user.uid}/supplements`);
        const docRef = await addDoc(supplementsCollection, supplement);
        setSupplements([...supplements, { id: docRef.id, ...supplement }]);
        setAddSupplementOpen(false);
      } catch (error) {
        console.error("Error adding supplement:", error);
      }
    }
  };

  const handleAddCycle = async (cycle: Omit<SteroidCycle, 'id'>) => {
    if (user) {
      try {
        const cyclesCollection = collection(db, `users/${user.uid}/cycles`);
        const docRef = await addDoc(cyclesCollection, cycle);
        setCycles([...cycles, { id: docRef.id, ...cycle }]);
        setAddCycleOpen(false);
      } catch (error) {
        console.error("Error adding cycle:", error);
      }
    }
  };

  const handleDeleteSupplement = async (supplementId: string) => {
    if (user) {
      try {
        const supplementDoc = doc(db, `users/${user.uid}/supplements`, supplementId);
        await deleteDoc(supplementDoc);
        setSupplements(supplements.filter(supplement => supplement.id !== supplementId));
      } catch (error) {
        console.error("Error deleting supplement:", error);
      }
    }
  };

  const handleDeleteCycle = async (cycleId: string) => {
    if (user) {
      try {
        const cycleDoc = doc(db, `users/${user.uid}/cycles`, cycleId);
        await deleteDoc(cycleDoc);
        setCycles(cycles.filter(cycle => cycle.id !== cycleId));
      } catch (error) {
        console.error("Error deleting cycle:", error);
      }
    }
  };

  const handleAddLog = (supplementId: string) => {
    // Placeholder for adding supplement log
    console.log(`Add log for supplement with ID: ${supplementId}`);
  };

  return (
    <div className="container pb-16">
      <NavigationHeader title="Supplements" showBack={true} />
      <div className="mt-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Supplements</CardTitle>
              <Dialog open={addSupplementOpen} onOpenChange={setAddSupplementOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Add Supplement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <AddSupplementForm onClose={() => setAddSupplementOpen(false)} onAdd={handleAddSupplement} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {supplements.length > 0 ? (
              <div className="space-y-3">
                {supplements.map((supplement) => (
                  <Card key={supplement.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{supplement.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {supplement.dosage}, {supplement.frequency}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAddLog(supplement.id)}>Log</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteSupplement(supplement.id)}>Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No supplements added yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="mt-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Steroid Cycles</CardTitle>
              <Dialog open={addCycleOpen} onOpenChange={setAddCycleOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Add Cycle
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <AddCycleForm onClose={() => setAddCycleOpen(false)} onAdd={handleAddCycle} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {cycles.length > 0 ? (
              <div className="space-y-3">
                {cycles.map((cycle) => (
                  <Card key={cycle.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{cycle.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cycle.startDate} - {cycle.endDate}
                        </p>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteCycle(cycle.id)}>Delete</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No cycles added yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Supplements;
