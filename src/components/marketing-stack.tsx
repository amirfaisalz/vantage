"use client";

import { motion } from "framer-motion";

interface MarketingTool {
  name: string;
  category: string;
  description: string;
  logo: string;
  color: string;
}

const marketingTools: MarketingTool[] = [
  // Analytics
  {
    name: "Segment",
    category: "Analytics",
    description: "Customer data platform",
    logo: "/icons/segment.svg",
    color: "#52BD95",
  },
  {
    name: "Mixpanel",
    category: "Analytics",
    description: "Product analytics",
    logo: "/icons/mixpanel.svg",
    color: "#7856FF",
  },
  {
    name: "Google Analytics",
    category: "Analytics",
    description: "Web analytics",
    logo: "/icons/ga4.svg",
    color: "#FF9500",
  },
  {
    name: "Amplitude",
    category: "Analytics",
    description: "Digital analytics",
    logo: "/icons/amplitude.svg",
    color: "#1C75BC",
  },
  // CRM
  {
    name: "HubSpot",
    category: "CRM",
    description: "Marketing automation",
    logo: "/icons/hubspot.svg",
    color: "#FF7A59",
  },
  {
    name: "Salesforce",
    category: "CRM",
    description: "Enterprise CRM",
    logo: "/icons/salesforce.svg",
    color: "#00A1E0",
  },
  // Email
  {
    name: "SendGrid",
    category: "Email",
    description: "Transactional email",
    logo: "/icons/sendgrid.svg",
    color: "#1A82E2",
  },
  {
    name: "Customer.io",
    category: "Email",
    description: "Marketing automation",
    logo: "/icons/customerio.svg",
    color: "#FFCD00",
  },
  // A/B Testing
  {
    name: "Optimizely",
    category: "A/B Testing",
    description: "Experimentation platform",
    logo: "/icons/optimizely.svg",
    color: "#0037FF",
  },
  {
    name: "LaunchDarkly",
    category: "A/B Testing",
    description: "Feature flags",
    logo: "/icons/launchdarkly.svg",
    color: "#3DD6F5",
  },
  // Attribution
  {
    name: "AppsFlyer",
    category: "Attribution",
    description: "Mobile attribution",
    logo: "/icons/appsflyer.svg",
    color: "#FF5733",
  },
  {
    name: "Branch",
    category: "Attribution",
    description: "Deep linking",
    logo: "/icons/branch.svg",
    color: "#47B881",
  },
];

const categories = [...new Set(marketingTools.map((t) => t.category))];

export function MarketingStack() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">
          Marketing Tech Stack
        </h3>
        <p className="text-sm text-zinc-500">
          Common integrations for growth engineering teams
        </p>
      </div>

      {categories.map((category, catIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIndex * 0.1 }}
        >
          <h4 className="mb-3 text-sm font-medium text-zinc-400">{category}</h4>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {marketingTools
              .filter((t) => t.category === category)
              .map((tool, toolIndex) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: catIndex * 0.1 + toolIndex * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="group cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${tool.color}20` }}
                    >
                      <div
                        className="h-5 w-5 rounded"
                        style={{ backgroundColor: tool.color }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-100 group-hover:text-orange-400 transition-colors">
                        {tool.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      ))}

      {/* Integration Status */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-800/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-zinc-100">Integration Status</p>
            <p className="text-sm text-zinc-500">
              All integrations are simulated for demonstration
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400">Mock Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
