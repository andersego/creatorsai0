
import { useState } from "react";
import Layout from "@/components/layout/layout";
import { VisionForm } from "@/components/vision/vision-form";
import { VisionBoard } from "@/components/vision/vision-board";
import { motion } from "framer-motion";

const Vision = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Vision</h1>
            <p className="text-muted-foreground mt-1">
              Define your vision through these four key areas
            </p>
          </div>

          <div className="grid gap-6">
            <VisionForm />
            <VisionBoard />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Vision;
