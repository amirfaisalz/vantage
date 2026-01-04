"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Play,
  Pause,
  CheckCircle,
  Trash2,
  Users,
  TrendingUp,
  FlaskConical,
  Trophy,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useABTestingStore } from "@/lib/ab-testing/store";
import { calculateConversionRate } from "@/lib/ab-testing/stats";
import type { Experiment, ExperimentStatus } from "@/lib/ab-testing/types";
import { useTrackingStore } from "@/lib/tracking/store";

const VARIANT_COLORS = ["#f97316", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];

function StatusBadge({ status }: { status: ExperimentStatus }) {
  const styles: Record<ExperimentStatus, string> = {
    draft: "bg-zinc-700/50 text-zinc-300 border-zinc-600",
    running: "bg-green-500/20 text-green-400 border-green-500/30",
    paused: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <Badge variant="outline" className={styles[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function ExperimentCard({
  experiment,
  onSimulate,
}: {
  experiment: Experiment;
  onSimulate: () => void;
}) {
  const { setStatus, deleteExperiment, updateTrafficSplit, calculateResults } =
    useABTestingStore();
  const { addEvent } = useTrackingStore();
  const [showSplitEditor, setShowSplitEditor] = useState(false);

  const pieData = experiment.variants.map((v, i) => ({
    name: v.name,
    value: v.trafficPercent,
    color: VARIANT_COLORS[i % VARIANT_COLORS.length],
  }));

  const barData = experiment.variants.map((v, i) => ({
    name: v.name,
    rate: calculateConversionRate(v.conversions, v.visitors),
    visitors: v.visitors,
    conversions: v.conversions,
    color: VARIANT_COLORS[i % VARIANT_COLORS.length],
  }));

  const handleStatusChange = (newStatus: ExperimentStatus) => {
    setStatus(experiment.id, newStatus);
    addEvent("Experiment_Status_Changed", "interaction", {
      experiment: experiment.name,
      status: newStatus,
    });
    if (newStatus === "completed") {
      calculateResults(experiment.id);
    }
  };

  const handleSimulate = () => {
    onSimulate();
    addEvent("Experiment_Simulated", "interaction", {
      experiment: experiment.name,
    });
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-5 w-5 text-orange-500" />
            <div>
              <CardTitle className="text-lg text-zinc-100">
                {experiment.name}
              </CardTitle>
              <p className="text-sm text-zinc-500">{experiment.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={experiment.status} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteExperiment(experiment.id)}
              className="text-zinc-400 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Traffic Split */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-800/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-medium text-zinc-300">
                Traffic Split
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSplitEditor(!showSplitEditor)}
                className="text-xs text-zinc-400"
              >
                {showSplitEditor ? "Done" : "Edit"}
              </Button>
            </div>

            {showSplitEditor ? (
              <div className="space-y-3">
                {experiment.variants.map((v, i) => (
                  <div key={v.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">{v.name}</span>
                      <span className="text-sm font-medium text-zinc-100">
                        {v.trafficPercent}%
                      </span>
                    </div>
                    <Slider
                      value={[v.trafficPercent]}
                      onValueChange={([newValue]) => {
                        const splits = experiment.variants.map((vv, ii) => {
                          if (ii === i) return newValue;
                          // Distribute remainder to other variants
                          const remaining = 100 - newValue;
                          const othersCount = experiment.variants.length - 1;
                          return Math.floor(remaining / othersCount);
                        });
                        updateTrafficSplit(experiment.id, splits);
                      }}
                      max={100}
                      step={5}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #27272a",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Traffic"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Conversion Rates */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-800/30 p-4">
            <h4 className="mb-2 text-sm font-medium text-zinc-300">
              Conversion Rates
            </h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [
                      `${value.toFixed(2)}%`,
                      "Rate",
                    ]}
                  />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Variants Summary */}
        <div className="grid gap-2">
          {experiment.variants.map((v, i) => (
            <div
              key={v.id}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/20 p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: VARIANT_COLORS[i % VARIANT_COLORS.length],
                  }}
                />
                <div>
                  <p className="font-medium text-zinc-100">{v.name}</p>
                  <p className="text-xs text-zinc-500">{v.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-medium text-zinc-100">{v.visitors}</p>
                  <p className="text-xs text-zinc-500">Visitors</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-green-400">{v.conversions}</p>
                  <p className="text-xs text-zinc-500">Conversions</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-orange-400">
                    {calculateConversionRate(v.conversions, v.visitors).toFixed(
                      2
                    )}
                    %
                  </p>
                  <p className="text-xs text-zinc-500">Rate</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        {experiment.results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg border p-4 ${
              experiment.results.isSignificant
                ? "border-green-500/30 bg-green-500/10"
                : "border-yellow-500/30 bg-yellow-500/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <Trophy
                className={`h-5 w-5 ${
                  experiment.results.isSignificant
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              />
              <span
                className={`font-medium ${
                  experiment.results.isSignificant
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {experiment.results.isSignificant
                  ? "Statistically Significant!"
                  : "Not Yet Significant"}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-zinc-500">Winner</p>
                <p className="font-medium text-zinc-100">
                  {experiment.variants.find(
                    (v) => v.id === experiment.results?.winner
                  )?.name || "TBD"}
                </p>
              </div>
              <div>
                <p className="text-zinc-500">Confidence</p>
                <p className="font-medium text-zinc-100">
                  {experiment.results.confidence}%
                </p>
              </div>
              <div>
                <p className="text-zinc-500">Uplift</p>
                <p
                  className={`font-medium ${
                    experiment.results.uplift > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {experiment.results.uplift > 0 ? "+" : ""}
                  {experiment.results.uplift}%
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {experiment.status === "draft" && (
            <Button
              onClick={() => handleStatusChange("running")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Experiment
            </Button>
          )}
          {experiment.status === "running" && (
            <>
              <Button
                onClick={() => handleStatusChange("paused")}
                variant="outline"
                className="border-yellow-600 text-yellow-400 hover:bg-yellow-500/10"
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
              <Button
                onClick={handleSimulate}
                variant="outline"
                className="border-zinc-700"
              >
                <Users className="mr-2 h-4 w-4" />
                Simulate Visitors
              </Button>
              <Button
                onClick={() => handleStatusChange("completed")}
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-500/10"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete
              </Button>
            </>
          )}
          {experiment.status === "paused" && (
            <Button
              onClick={() => handleStatusChange("running")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ABTestPanel() {
  const { experiments, createExperiment, simulateVisitors } =
    useABTestingStore();
  const { addEvent } = useTrackingStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;

    const exp = createExperiment(newName, newDescription);
    addEvent("Experiment_Created", "interaction", { name: exp.name });
    setNewName("");
    setNewDescription("");
    setIsDialogOpen(false);
  };

  const runningExperiments = experiments.filter(
    (e) => e.status === "running"
  ).length;
  const totalVisitors = experiments.reduce(
    (sum, e) => sum + e.variants.reduce((s, v) => s + v.visitors, 0),
    0
  );
  const totalConversions = experiments.reduce(
    (sum, e) => sum + e.variants.reduce((s, v) => s + v.conversions, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">A/B Experiments</h1>
          <p className="text-zinc-400">
            Configure and monitor your experiments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Experiment
            </Button>
          </DialogTrigger>
          <DialogContent className="border-zinc-800 bg-zinc-900">
            <DialogHeader>
              <DialogTitle className="text-zinc-100">
                Create New Experiment
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-300">
                  Experiment Name
                </Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Hero Button Color Test"
                  className="border-zinc-700 bg-zinc-800 text-zinc-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-zinc-300">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What are you testing?"
                  className="border-zinc-700 bg-zinc-800 text-zinc-100"
                />
              </div>
              <Button
                onClick={handleCreate}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Create Experiment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FlaskConical className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-zinc-100">
                  {runningExperiments}
                </p>
                <p className="text-sm text-zinc-500">Running Experiments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-zinc-100">
                  {totalVisitors.toLocaleString()}
                </p>
                <p className="text-sm text-zinc-500">Total Visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-zinc-100">
                  {totalConversions.toLocaleString()}
                </p>
                <p className="text-sm text-zinc-500">Total Conversions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Experiments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {experiments.length === 0 ? (
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="py-12 text-center">
                <FlaskConical className="mx-auto h-12 w-12 text-zinc-600" />
                <h3 className="mt-4 text-lg font-medium text-zinc-300">
                  No experiments yet
                </h3>
                <p className="mt-2 text-zinc-500">
                  Create your first experiment to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            experiments.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.1 }}
              >
                <ExperimentCard
                  experiment={exp}
                  onSimulate={() => simulateVisitors(exp.id)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
