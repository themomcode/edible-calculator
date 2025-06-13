import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Leaf, Beaker, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import AgeVerificationDialog from '@/components/AgeVerificationDialog';

function App() {
  const [isVerified, setIsVerified] = useState(false);
  const [herbAmount, setHerbAmount] = useState('');
  const [herbPotency, setHerbPotency] = useState('');
  const [fatAmount, setFatAmount] = useState('');
  const [fatType, setFatType] = useState('butter');
  const [servings, setServings] = useState('');
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const hasVerified = localStorage.getItem('ageVerified') === 'true';
    if (hasVerified) {
      setIsVerified(true);
    }
  }, []);

  const handleVerification = () => {
    localStorage.setItem('ageVerified', 'true');
    setIsVerified(true);
  };

  const calculateDosage = () => {
    if (!herbAmount || !herbPotency || !fatAmount || !servings) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to calculate dosage.",
        variant: "destructive"
      });
      return;
    }

    const herbAmountNum = parseFloat(herbAmount);
    const herbPotencyNum = parseFloat(herbPotency);
    const fatAmountNum = parseFloat(fatAmount);
    const servingsNum = parseInt(servings);

    const totalCannabinoids = (herbAmountNum * 1000) * (herbPotencyNum / 100);
    const extractedCannabinoids = totalCannabinoids * 0.8;
    const perServing = extractedCannabinoids / servingsNum;
    const perGramFat = extractedCannabinoids / fatAmountNum;

    setResults({
      totalCannabinoids: totalCannabinoids.toFixed(1),
      extractedCannabinoids: extractedCannabinoids.toFixed(1),
      perServing: perServing.toFixed(1),
      perGramFat: perGramFat.toFixed(1),
      fatType
    });

    toast({
      title: "Calculation Complete! 🌿",
      description: `Your infusion will have approximately ${perServing.toFixed(1)}mg per serving.`
    });
  };

  const resetCalculator = () => {
    setHerbAmount('');
    setHerbPotency('');
    setFatAmount('');
    setServings('');
    setResults(null);
    toast({
      title: "Calculator Reset",
      description: "All fields have been cleared."
    });
  };

  const saveCalculation = () => {
    if (!results) {
      toast({
        title: "No Calculation to Save",
        description: "Please calculate dosage first before saving.",
        variant: "destructive"
      });
      return;
    }

    const calculation = {
      herbAmount,
      herbPotency,
      fatAmount,
      fatType,
      servings,
      results,
      timestamp: new Date().toISOString()
    };

    const savedCalculations = JSON.parse(localStorage.getItem('herbCalculations') || '[]');
    savedCalculations.push(calculation);
    localStorage.setItem('herbCalculations', JSON.stringify(savedCalculations));

    toast({
      title: "Calculation Saved! 💾",
      description: "Your calculation has been saved to local storage."
    });
  };

  return (
    <div className="min-h-screen cannabis-pattern">
      {!isVerified && <AgeVerificationDialog onVerified={handleVerification} />}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Leaf className="h-12 w-12 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
              Herb Infusion Calculator
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Calculate precise dosages for your homemade THC and CBD edibles with confidence
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="calculator-card glow-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-primary" />
                  Dosage Calculator
                </CardTitle>
                <CardDescription>
                  Enter your herb and fat details to calculate precise dosages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="herbAmount">Herb Amount (grams)</Label>
                    <Input
                      id="herbAmount"
                      type="number"
                      placeholder="e.g., 3.5"
                      value={herbAmount}
                      onChange={(e) => setHerbAmount(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="herbPotency">THC/CBD Potency (%)</Label>
                    <Input
                      id="herbPotency"
                      type="number"
                      placeholder="e.g., 20"
                      value={herbPotency}
                      onChange={(e) => setHerbPotency(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatAmount">Fat Amount (grams/ml)</Label>
                    <Input
                      id="fatAmount"
                      type="number"
                      placeholder="e.g., 100"
                      value={fatAmount}
                      onChange={(e) => setFatAmount(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatType">Fat Type</Label>
                    <Select value={fatType} onValueChange={setFatType}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="butter">Butter</SelectItem>
                        <SelectItem value="coconut-oil">Coconut Oil</SelectItem>
                        <SelectItem value="olive-oil">Olive Oil</SelectItem>
                        <SelectItem value="mct-oil">MCT Oil</SelectItem>
                        <SelectItem value="ghee">Ghee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings">Number of Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    placeholder="e.g., 12"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={calculateDosage}
                    className="flex-1 herb-gradient hover:scale-105 transition-transform"
                  >
                    <Beaker className="h-4 w-4 mr-2" />
                    Calculate Dosage
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetCalculator}
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {results && (
              <Card className="calculator-card glow-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Info className="h-6 w-6" />
                    Dosage Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground">Total Cannabinoids</p>
                      <p className="text-2xl font-bold text-primary">{results.totalCannabinoids}mg</p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground">Extracted (80% efficiency)</p>
                      <p className="text-2xl font-bold text-primary">{results.extractedCannabinoids}mg</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 p-6 rounded-lg border border-green-500/30">
                    <p className="text-sm text-muted-foreground mb-2">Per Serving Dosage</p>
                    <p className="text-3xl font-bold text-green-400">{results.perServing}mg</p>
                  </div>

                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Per gram of {results.fatType}</p>
                    <p className="text-xl font-semibold">{results.perGramFat}mg</p>
                  </div>

                  <Button 
                    onClick={saveCalculation}
                    variant="outline"
                    className="w-full border-primary/30 hover:bg-primary/10"
                  >
                    Save Calculation
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="calculator-card">
              <CardHeader>
                <CardTitle className="text-yellow-400">⚠️ Important Safety Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>• Start with small doses (2.5-5mg) and wait 2+ hours before consuming more</p>
                <p>• Effects can take 30 minutes to 2 hours to appear</p>
                <p>• This calculator assumes 80% extraction efficiency</p>
                <p>• Actual potency may vary based on decarboxylation and infusion methods</p>
                <p>• Always label your edibles and store safely away from children and pets</p>
                <p>• Check local laws regarding cannabis use and possession</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="calculator-card max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">🌿</span>
                  </div>
                  <span className="font-semibold text-primary">Step 1: Decarboxylation</span>
                  <p className="text-sm text-muted-foreground">
                    Heat your herb to activate THC/CBD (usually 240°F for 40 minutes)
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">🧈</span>
                  </div>
                  <span className="font-semibold text-primary">Step 2: Infusion</span>
                  <p className="text-sm text-muted-foreground">
                    Slowly heat herb with fat for 2-4 hours to extract cannabinoids
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">🍪</span>
                  </div>
                  <span className="font-semibold text-primary">Step 3: Calculate</span>
                  <p className="text-sm text-muted-foreground">
                    Use this calculator to determine precise dosages for your recipes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;