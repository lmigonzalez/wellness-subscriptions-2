"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { DailyPlan } from "@/lib/data";

import { Playfair_Display } from "next/font/google";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});


function RevealOnScroll({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Dashboard() {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const premiumParam = searchParams.get("is_premium");
    const isUserPremium = premiumParam === "true";
    setIsPremium(isUserPremium);

    if (isUserPremium) {
      fetchDailyPlan();
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchDailyPlan = async () => {
    try {
      setLoading(true);
      // Add timestamp and random number to force fresh requests
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(7);
      const response = await fetch(
        `/api/daily-plan?t=${timestamp}&r=${random}`,
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch daily plan");
      }
      const data = await response.json();
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Premium access check
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <RevealOnScroll delay={0}>
            <div className="mb-8">
              <RevealOnScroll delay={0.1}>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </RevealOnScroll>
              <RevealOnScroll delay={0.2}>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Premium Access Required
                </h1>
              </RevealOnScroll>
              <RevealOnScroll delay={0.3}>
                <p className="text-xl text-white mb-8">
                  The Daily Wellness Dashboard is exclusively available to
                  premium members.
                </p>
              </RevealOnScroll>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.4}>
            <div className="bg-gray-950 rounded-lg p-8 mb-8">
              <RevealOnScroll delay={0.5}>
                <h2 className="text-2xl font-semibold text-white mb-6">
                  🌟 What You&apos;ll Get with Premium Access
                </h2>
              </RevealOnScroll>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <RevealOnScroll delay={0.6}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Daily AI-Generated Content
                      </h3>
                      <p className="text-white text-sm">
                        Fresh quotes, workouts, and meal plans every day
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.7}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Daily Home Workouts
                      </h3>
                      <p className="text-white text-sm">
                        7 fresh bodyweight exercises daily • No equipment needed
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.8}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Complete Meal Plans
                      </h3>
                      <p className="text-white text-sm">
                        Breakfast, lunch, and dinner with recipes
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.9}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Daily Email & PDF
                      </h3>
                      <p className="text-white text-sm">
                        Get your plan delivered every morning
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={1.0}>
            <div className="text-white">
              <RevealOnScroll delay={1.1}>
                <p className="mb-4">
                  💡 To access the Daily Wellness Dashboard, you need to be a
                  premium member.
                </p>
              </RevealOnScroll>
              <RevealOnScroll delay={1.2}>
                <p className="text-sm">
                  Visit our Shopify store to upgrade your account and unlock
                  exclusive wellness content.
                </p>
              </RevealOnScroll>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RevealOnScroll>
          <div className="text-white text-xl">
            Loading your wellness plan...
          </div>
        </RevealOnScroll>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RevealOnScroll>
          <div className="text-red-400 text-xl">
            Error: {error || "No plan available"}
          </div>
        </RevealOnScroll>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <RevealOnScroll>
        <header className="bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <RevealOnScroll delay={0.1}>
              <div className="text-center">
                <RevealOnScroll delay={0.2}>
                  <h1
                    className={`text-3xl font-bold text-white ${playfairDisplay.className}`}
                  >
                    Your Daily Wellness Dashboard
                  </h1>
                </RevealOnScroll>
                <RevealOnScroll delay={0.3}>
                  <p className="text-white mt-2">{today}</p>
                </RevealOnScroll>
              </div>
            </RevealOnScroll>
          </div>
        </header>
      </RevealOnScroll>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quote of the Day */}
        <RevealOnScroll delay={0.4}>
          <section className="mb-12">
            <div className="bg-black rounded-lg p-8 text-center border border-gray-700">
              <RevealOnScroll delay={0.5}>
                <blockquote className="text-xl italic mb-4">
                  &quot;{plan.quote.text}&quot;
                </blockquote>
              </RevealOnScroll>
              <RevealOnScroll delay={0.6}>
                <cite className="text-gray-400">— {plan.quote.author}</cite>
              </RevealOnScroll>
            </div>
          </section>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Workout Plan */}
          <RevealOnScroll delay={0.7}>
            <section className="bg-black rounded-lg p-6 border border-gray-700">
              <RevealOnScroll delay={0.8}>
                <h2
                  className={`text-2xl font-semibold mb-4 text-white flex items-center ${playfairDisplay.className}`}
                >
                  <span className="mr-3">💪</span>
                  Today&apos;s Workout Plan
                </h2>
              </RevealOnScroll>
              <RevealOnScroll delay={0.9}>
                <p className="text-white text-sm mb-4 italic">
                  🏠 Fresh daily home workout • 7 bodyweight exercises • No
                  equipment needed
                </p>
              </RevealOnScroll>
              <div className="space-y-4">
                {plan.workout.map((exercise, index) => (
                  <RevealOnScroll key={index} delay={1.0 + index * 0.1}>
                    <div className="bg-black rounded-lg p-4">
                      <h3
                        className={`font-semibold text-lg text-white mb-2 ${playfairDisplay.className}`}
                      >
                        {exercise.name}
                      </h3>
                      <p className="text-white mb-2">{exercise.description}</p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="bg-gray-950 px-2 py-1 rounded text-white">
                          {exercise.duration}
                        </span>
                        {exercise.sets && (
                          <span className="bg-gray-950 px-2 py-1 rounded text-white">
                            {exercise.sets} sets
                          </span>
                        )}
                        {exercise.reps && (
                          <span className="bg-gray-950 px-2 py-1 rounded text-white">
                            {exercise.reps} reps
                          </span>
                        )}
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </section>
          </RevealOnScroll>

          {/* Meal Plan */}
          <RevealOnScroll delay={1.1}>
            <section className="bg-black rounded-lg p-6 border border-gray-700">
              <RevealOnScroll delay={1.2}>
                <h2
                  className={`text-2xl font-semibold mb-4 text-white flex items-center ${playfairDisplay.className}`}
                >
                  <span className="mr-3">🥗</span>
                  Today&apos;s Meal Plan
                </h2>
              </RevealOnScroll>
              <RevealOnScroll delay={1.3}>
                <p className="text-white text-sm mb-4 italic">
                  🍽️ Fresh daily recipes designed for today
                </p>
              </RevealOnScroll>
              <div className="space-y-6">
                {/* Breakfast */}
                <RevealOnScroll delay={1.4}>
                  <div className="bg-black rounded-lg p-4">
                    <h3
                      className={`font-semibold text-lg text-white mb-2 ${playfairDisplay.className}`}
                    >
                      🌅 Breakfast - {plan.meals.breakfast.name}
                    </h3>
                    <p className="text-white mb-2">
                      {plan.meals.breakfast.description}
                    </p>
                    <p className="text-sm text-gray-400 mb-3">
                      {plan.meals.breakfast.calories} calories
                    </p>

                    <div className="mb-3">
                      <h4 className="font-medium text-white mb-1">
                        Ingredients:
                      </h4>
                      <ul className="text-sm text-white list-disc list-inside">
                        {plan.meals.breakfast.ingredients.map(
                          (ingredient, i) => (
                            <li key={i}>{ingredient}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-1">
                        Instructions:
                      </h4>
                      <ol className="text-sm text-white list-decimal list-inside space-y-1">
                        {plan.meals.breakfast.instructions.map(
                          (instruction, i) => (
                            <li key={i}>{instruction}</li>
                          )
                        )}
                      </ol>
                    </div>
                  </div>
                </RevealOnScroll>

                {/* Lunch */}
                <RevealOnScroll delay={1.5}>
                  <div className="bg-black rounded-lg p-4">
                    <h3
                      className={`font-semibold text-lg text-white mb-2 ${playfairDisplay.className}`}
                    >
                      ☀️ Lunch - {plan.meals.lunch.name}
                    </h3>
                    <p className="text-white mb-2">
                      {plan.meals.lunch.description}
                    </p>
                    <p className="text-sm text-gray-400 mb-3">
                      {plan.meals.lunch.calories} calories
                    </p>

                    <div className="mb-3">
                      <h4 className="font-medium text-white mb-1">
                        Ingredients:
                      </h4>
                      <ul className="text-sm text-white list-disc list-inside">
                        {plan.meals.lunch.ingredients.map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-1">
                        Instructions:
                      </h4>
                      <ol className="text-sm text-white list-decimal list-inside space-y-1">
                        {plan.meals.lunch.instructions.map((instruction, i) => (
                          <li key={i}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </RevealOnScroll>

                {/* Dinner */}
                <RevealOnScroll delay={1.6}>
                  <div className="bg-black rounded-lg p-4">
                    <h3
                      className={`font-semibold text-lg text-white mb-2 ${playfairDisplay.className}`}
                    >
                      🌙 Dinner - {plan.meals.dinner.name}
                    </h3>
                    <p className="text-white mb-2">
                      {plan.meals.dinner.description}
                    </p>
                    <p className="text-sm text-gray-400 mb-3">
                      {plan.meals.dinner.calories} calories
                    </p>

                    <div className="mb-3">
                      <h4 className="font-medium text-white mb-1">
                        Ingredients:
                      </h4>
                      <ul className="text-sm text-white list-disc list-inside">
                        {plan.meals.dinner.ingredients.map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-1">
                        Instructions:
                      </h4>
                      <ol className="text-sm text-white list-decimal list-inside space-y-1">
                        {plan.meals.dinner.instructions.map(
                          (instruction, i) => (
                            <li key={i}>{instruction}</li>
                          )
                        )}
                      </ol>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </section>
          </RevealOnScroll>
        </div>
      </main>

      {/* Footer */}
      <RevealOnScroll delay={1.7}>
        <footer className="bg-black border-t border-gray-700 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-white">
              <p>
                Your daily wellness journey starts here. Updated every day at
                4:00 AM EST (9:00 AM UTC) with fresh workouts and quotes.
              </p>
            </div>
          </div>
        </footer>
      </RevealOnScroll>
    </div>
  );
}
