import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Clock, MapPin, Star, Timer, ChefHat } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { DecorativeShapes } from "./DecorativeShapes";
import { useBlogSettings } from "./hooks/useBlogSettings";

export function MenuPage() {
  const shapes = DecorativeShapes();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { isWhiteBackground } = useBlogSettings();

  const menuTestimonials = [
    {
      name: "Segun Akinlade",
      role: "Tech Professional, Lekki",
      result: "Ordered 50+ times",
      quote: "Best jollof rice in Lagos. Consistent quality. Fast delivery even during peak hours. My go-to for lunch.",
      image: "https://images.unsplash.com/photo-1619452220963-4da4e145aba9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTc3NzAwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Blessing Okafor",
      role: "Entrepreneur, Ikeja",
      result: "Regular Customer",
      quote: "The variety is amazing. From traditional soups to healthy bowls. Quality never disappoints. Delivery is always on time.",
      image: "https://images.unsplash.com/photo-1709202967828-e1a7823ccdf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcHJvZmVzc2lvbmFsJTIwd29tYW4lMjBzbWlsaW5nfGVufDF8fHx8MTc2MTc3NzAwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Ibrahim Musa",
      role: "Doctor, Victoria Island",
      result: "Daily Lunch Orders",
      quote: "Perfect portion sizes. Food arrives hot. The egusi soup reminds me of home. EatsApp saved my lunch breaks.",
      image: "https://images.unsplash.com/photo-1731093714827-ba0353e09bfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3NtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjE3Mjg4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Funmi Adeleke",
      role: "Lawyer, Ikoyi",
      result: "5-Star Experience",
      quote: "Fresh ingredients. Authentic Nigerian taste. Fair prices. This is what Lagos food delivery should be.",
      image: "https://images.unsplash.com/photo-1655720357872-ce227e4164ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBlbnRyZXByZW5ldXJ8ZW58MXx8fHwxNzYxNzc3MDA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Chijioke Obi",
      role: "Engineer, Yaba",
      result: "Trusted for 8 Months",
      quote: "From suya to seafood okra. Everything is perfectly spiced. Delivery guys are professional. Highly recommend!",
      image: "https://images.unsplash.com/photo-1604783020105-a1c1a856a55d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIweW91bmclMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYxNzc3MDA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Amaka Johnson",
      role: "Content Creator, Surulere",
      result: "Weekly Regular",
      quote: "Their breakfast menu is a lifesaver. Beans and plantain on point. Customer service is excellent. Love EatsApp!",
      image: "https://images.unsplash.com/photo-1610626295085-aa8d6ae8daec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBjb25maWRlbnR8ZW58MXx8fHwxNzYxNzc3MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const categories = [
    { id: "all", label: "All Meals" },
    { id: "soups", label: "Soups", parent: "nigerian" },
    { id: "swallow", label: "Swallow", parent: "nigerian" },
    { id: "rice", label: "Rice Dishes", parent: "nigerian" },
    { id: "proteins", label: "Proteins", parent: "nigerian" },
    { id: "street", label: "Street Food", parent: "nigerian" },
    { id: "breakfast", label: "Breakfast", parent: "nigerian" },
    { id: "fit", label: "Healthy" },
    { id: "vegan", label: "Vegan" },
  ];

  const menuItems = [
    // SOUPS
    {
      id: 1,
      name: "Egusi Soup with Assorted Meat",
      category: "soups",
      price: "₦3,500",
      prepTime: "35-40 mins",
      kitchen: "Mama's Pot Kitchen",
      calories: 680,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.9,
    },
    {
      id: 2,
      name: "Ogbono Soup with Beef",
      category: "soups",
      price: "₦3,200",
      prepTime: "30-35 mins",
      kitchen: "TasteBudz Kitchen",
      calories: 620,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.8,
    },
    {
      id: 3,
      name: "Efo Riro with Assorted",
      category: "soups",
      price: "₦3,400",
      prepTime: "30-35 mins",
      kitchen: "Yoruba Delights",
      calories: 650,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Vegetable"],
      rating: 4.9,
    },
    {
      id: 4,
      name: "Banga Soup with Catfish",
      category: "soups",
      price: "₦4,000",
      prepTime: "40-45 mins",
      kitchen: "Delta Kitchen",
      calories: 720,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Spicy"],
      rating: 4.8,
    },
    {
      id: 5,
      name: "Oha Soup with Goat Meat",
      category: "soups",
      price: "₦3,800",
      prepTime: "35-40 mins",
      kitchen: "Igbo Kitchen",
      calories: 690,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Premium"],
      rating: 4.9,
    },
    {
      id: 6,
      name: "Nsala Soup (White Soup)",
      category: "soups",
      price: "₦3,600",
      prepTime: "35-40 mins",
      kitchen: "Igbo Kitchen",
      calories: 640,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.7,
    },
    {
      id: 7,
      name: "Afang Soup",
      category: "soups",
      price: "₦3,900",
      prepTime: "40-45 mins",
      kitchen: "Calabar Kitchen",
      calories: 710,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.9,
    },
    {
      id: 8,
      name: "Edikang Ikong Soup",
      category: "soups",
      price: "₦4,200",
      prepTime: "40-45 mins",
      kitchen: "Calabar Kitchen",
      calories: 730,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Premium"],
      rating: 4.9,
    },
    {
      id: 9,
      name: "Okro Soup with Fish",
      category: "soups",
      price: "₦3,000",
      prepTime: "25-30 mins",
      kitchen: "Mama's Pot Kitchen",
      calories: 580,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Quick"],
      rating: 4.7,
    },
    {
      id: 10,
      name: "Gbegiri & Ewedu Combo",
      category: "soups",
      price: "₦2,800",
      prepTime: "30-35 mins",
      kitchen: "Yoruba Delights",
      calories: 520,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.8,
    },
    {
      id: 11,
      name: "Vegetable Soup",
      category: "soups",
      price: "₦3,100",
      prepTime: "30-35 mins",
      kitchen: "Mama's Pot Kitchen",
      calories: 600,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Healthy"],
      rating: 4.7,
    },
    {
      id: 12,
      name: "Pepper Soup (Catfish)",
      category: "soups",
      price: "₦3,500",
      prepTime: "25-30 mins",
      kitchen: "TasteBudz Kitchen",
      calories: 480,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMHBlcHBlciUyMHNvdXB8ZW58MXx8fHwxNzYxNzc1ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Spicy"],
      rating: 4.8,
    },

    // SWALLOW
    {
      id: 13,
      name: "Pounded Yam (Large)",
      category: "swallow",
      price: "₦1,500",
      prepTime: "20-25 mins",
      kitchen: "Swallow Spot",
      calories: 420,
      image: "https://images.unsplash.com/photo-1614725363900-538db555d7b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3VuZGVkJTIweWFtJTIwZnVmdXxlbnwxfHx8fDE3NjE3NzU4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.9,
    },
    {
      id: 14,
      name: "Eba (Garri)",
      category: "swallow",
      price: "₦800",
      prepTime: "15-20 mins",
      kitchen: "Swallow Spot",
      calories: 360,
      image: "https://images.unsplash.com/photo-1614725363900-538db555d7b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3VuZGVkJTIweWFtJTIwZnVmdXxlbnwxfHx8fDE3NjE3NzU4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Quick"],
      rating: 4.7,
    },
    {
      id: 15,
      name: "Fufu",
      category: "swallow",
      price: "₦1,200",
      prepTime: "20-25 mins",
      kitchen: "Swallow Spot",
      calories: 390,
      image: "https://images.unsplash.com/photo-1614725363900-538db555d7b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3VuZGVkJTIweWFtJTIwZnVmdXxlbnwxfHx8fDE3NjE3NzU4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.8,
    },
    {
      id: 16,
      name: "Amala",
      category: "swallow",
      price: "₦1,000",
      prepTime: "15-20 mins",
      kitchen: "Yoruba Delights",
      calories: 350,
      image: "https://images.unsplash.com/photo-1614725363900-538db555d7b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3VuZGVkJTIweWFtJTIwZnVmdXxlbnwxfHx8fDE3NjE3NzU4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.9,
    },
    {
      id: 17,
      name: "Semovita",
      category: "swallow",
      price: "₦900",
      prepTime: "15-20 mins",
      kitchen: "Swallow Spot",
      calories: 370,
      image: "https://images.unsplash.com/photo-1614725363900-538db555d7b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3VuZGVkJTIweWFtJTIwZnVmdXxlbnwxfHx8fDE3NjE3NzU4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Quick"],
      rating: 4.6,
    },
    {
      id: 18,
      name: "Wheat (Swallow)",
      category: "swallow",
      price: "₦1,000",
      prepTime: "15-20 mins",
      kitchen: "Swallow Spot",
      calories: 380,
      image: "https://images.unsplash.com/photo-1614725363900-538db555d7b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3VuZGVkJTIweWFtJTIwZnVmdXxlbnwxfHx8fDE3NjE3NzU4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Healthy"],
      rating: 4.7,
    },
    {
      id: 19,
      name: "Tuwo Shinkafa",
      category: "swallow",
      price: "₦1,100",
      prepTime: "20-25 mins",
      kitchen: "Naija Kitchen",
      calories: 400,
      image: "https://images.unsplash.com/photo-1614725363900-538db555d7b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3VuZGVkJTIweWFtJTIwZnVmdXxlbnwxfHx8fDE3NjE3NzU4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Northern"],
      rating: 4.8,
    },
    {
      id: 20,
      name: "Starch",
      category: "swallow",
      price: "₦1,300",
      prepTime: "20-25 mins",
      kitchen: "Delta Kitchen",
      calories: 410,
      image: "https://images.unsplash.com/photo-1614725363900-538db555d7b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3VuZGVkJTIweWFtJTIwZnVmdXxlbnwxfHx8fDE3NjE3NzU4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.7,
    },

    // RICE DISHES
    {
      id: 21,
      name: "Jollof Rice with Chicken",
      category: "rice",
      price: "₦2,800",
      prepTime: "25-30 mins",
      kitchen: "TasteBudz Kitchen",
      calories: 650,
      image: "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGpvbGxvZiUyMHJpY2V8ZW58MXx8fHwxNzYxNjkyNjYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.8,
    },
    {
      id: 22,
      name: "Jollof Rice with Turkey",
      category: "rice",
      price: "₦3,200",
      prepTime: "25-30 mins",
      kitchen: "TasteBudz Kitchen",
      calories: 680,
      image: "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGpvbGxvZiUyMHJpY2V8ZW58MXx8fHwxNzYxNjkyNjYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Premium"],
      rating: 4.9,
    },
    {
      id: 23,
      name: "Jollof Rice with Fish",
      category: "rice",
      price: "₦3,000",
      prepTime: "25-30 mins",
      kitchen: "TasteBudz Kitchen",
      calories: 620,
      image: "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGpvbGxvZiUyMHJpY2V8ZW58MXx8fHwxNzYxNjkyNjYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.7,
    },
    {
      id: 24,
      name: "Fried Rice with Chicken",
      category: "rice",
      price: "₦2,900",
      prepTime: "25-30 mins",
      kitchen: "TasteBudz Kitchen",
      calories: 640,
      image: "https://images.unsplash.com/photo-1635360065676-f47200966893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGZyaWVkJTIwcmljZXxlbnwxfHx8fDE3NjE3NzU4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.8,
    },
    {
      id: 25,
      name: "Ofada Rice & Ayamase",
      category: "rice",
      price: "₦3,000",
      prepTime: "30-35 mins",
      kitchen: "Yoruba Delights",
      calories: 680,
      image: "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGpvbGxvZiUyMHJpY2V8ZW58MXx8fHwxNzYxNjkyNjYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.9,
    },
    {
      id: 26,
      name: "Coconut Rice",
      category: "rice",
      price: "₦2,700",
      prepTime: "25-30 mins",
      kitchen: "Naija Kitchen",
      calories: 610,
      image: "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGpvbGxvZiUyMHJpY2V8ZW58MXx8fHwxNzYxNjkyNjYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Sweet"],
      rating: 4.7,
    },
    {
      id: 27,
      name: "Native Rice (Stone Rice)",
      category: "rice",
      price: "₦2,900",
      prepTime: "30-35 mins",
      kitchen: "Delta Kitchen",
      calories: 660,
      image: "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGpvbGxvZiUyMHJpY2V8ZW58MXx8fHwxNzYxNjkyNjYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.8,
    },
    {
      id: 28,
      name: "Concoction Rice",
      category: "rice",
      price: "₦2,600",
      prepTime: "25-30 mins",
      kitchen: "Naija Kitchen",
      calories: 630,
      image: "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGpvbGxvZiUyMHJpY2V8ZW58MXx8fHwxNzYxNjkyNjYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.6,
    },
    {
      id: 29,
      name: "White Rice & Stew",
      category: "rice",
      price: "₦2,400",
      prepTime: "20-25 mins",
      kitchen: "Mama's Pot Kitchen",
      calories: 580,
      image: "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGpvbGxvZiUyMHJpY2V8ZW58MXx8fHwxNzYxNjkyNjYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Classic"],
      rating: 4.7,
    },
    {
      id: 30,
      name: "Basmati Jollof Rice",
      category: "rice",
      price: "₦3,200",
      prepTime: "25-30 mins",
      kitchen: "TasteBudz Kitchen",
      calories: 640,
      image: "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGpvbGxvZiUyMHJpY2V8ZW58MXx8fHwxNzYxNjkyNjYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Premium"],
      rating: 4.9,
    },

    // PROTEINS
    {
      id: 31,
      name: "Suya (Beef)",
      category: "proteins",
      price: "₦2,500",
      prepTime: "20-25 mins",
      kitchen: "Suya King",
      calories: 420,
      image: "https://images.unsplash.com/photo-1700135925872-1df223756392?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXlhJTIwbmlnZXJpYW4lMjBncmlsbGVkJTIwbWVhdHxlbnwxfHx8fDE3NjE3NzU4NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.9,
    },
    {
      id: 32,
      name: "Asun (Peppered Goat Meat)",
      category: "proteins",
      price: "₦3,500",
      prepTime: "30-35 mins",
      kitchen: "Yoruba Delights",
      calories: 520,
      image: "https://images.unsplash.com/photo-1700135925872-1df223756392?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXlhJTIwbmlnZXJpYW4lMjBncmlsbGVkJTIwbWVhdHxlbnwxfHx8fDE3NjE3NzU4NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Spicy"],
      rating: 4.9,
    },
    {
      id: 33,
      name: "Peppered Chicken",
      category: "proteins",
      price: "₦2,800",
      prepTime: "25-30 mins",
      kitchen: "TasteBudz Kitchen",
      calories: 450,
      image: "https://images.unsplash.com/photo-1652545296882-cf7f118c4df5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMGFmcmljYW58ZW58MXx8fHwxNzYxNzc1ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.8,
    },
    {
      id: 34,
      name: "Grilled Chicken (Full)",
      category: "proteins",
      price: "₦4,500",
      prepTime: "35-40 mins",
      kitchen: "Grill Master",
      calories: 580,
      image: "https://images.unsplash.com/photo-1652545296882-cf7f118c4df5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMGFmcmljYW58ZW58MXx8fHwxNzYxNzc1ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Premium"],
      rating: 4.9,
    },
    {
      id: 35,
      name: "Grilled Chicken (Half)",
      category: "proteins",
      price: "₦2,500",
      prepTime: "25-30 mins",
      kitchen: "Grill Master",
      calories: 320,
      image: "https://images.unsplash.com/photo-1652545296882-cf7f118c4df5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMGFmcmljYW58ZW58MXx8fHwxNzYxNzc1ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.8,
    },
    {
      id: 36,
      name: "Peppered Fish",
      category: "proteins",
      price: "₦3,000",
      prepTime: "25-30 mins",
      kitchen: "Fish House",
      calories: 380,
      image: "https://images.unsplash.com/photo-1665401015549-712c0dc5ef85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGZpc2glMjBhZnJpY2FufGVufDF8fHx8MTc2MTc3NTg1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Seafood"],
      rating: 4.7,
    },
    {
      id: 37,
      name: "Fried Turkey",
      category: "proteins",
      price: "₦3,200",
      prepTime: "30-35 mins",
      kitchen: "Naija Kitchen",
      calories: 480,
      image: "https://images.unsplash.com/photo-1652545296882-cf7f118c4df5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMGFmcmljYW58ZW58MXx8fHwxNzYxNzc1ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Premium"],
      rating: 4.9,
    },
    {
      id: 38,
      name: "Cow Leg (Ponmo)",
      category: "proteins",
      price: "₦1,500",
      prepTime: "20-25 mins",
      kitchen: "Mama's Pot Kitchen",
      calories: 280,
      image: "https://images.unsplash.com/photo-1700135925872-1df223756392?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXlhJTIwbmlnZXJpYW4lMjBncmlsbGVkJTIwbWVhdHxlbnwxfHx8fDE3NjE3NzU4NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.6,
    },
    {
      id: 39,
      name: "Assorted Meat",
      category: "proteins",
      price: "₦2,000",
      prepTime: "25-30 mins",
      kitchen: "TasteBudz Kitchen",
      calories: 450,
      image: "https://images.unsplash.com/photo-1700135925872-1df223756392?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXlhJTIwbmlnZXJpYW4lMjBncmlsbGVkJTIwbWVhdHxlbnwxfHx8fDE3NjE3NzU4NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.7,
    },
    {
      id: 40,
      name: "Gizzard (Peppered)",
      category: "proteins",
      price: "₦2,200",
      prepTime: "25-30 mins",
      kitchen: "Naija Kitchen",
      calories: 340,
      image: "https://images.unsplash.com/photo-1652545296882-cf7f118c4df5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMGFmcmljYW58ZW58MXx8fHwxNzYxNzc1ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Spicy"],
      rating: 4.8,
    },

    // STREET FOOD
    {
      id: 41,
      name: "Puff Puff (6 pieces)",
      category: "street",
      price: "₦500",
      prepTime: "10-15 mins",
      kitchen: "Street Bites",
      calories: 320,
      image: "https://images.unsplash.com/photo-1665833613236-7c1d087463b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMHB1ZmYlMjBwdWZmfGVufDF8fHx8MTc2MTc3NTU1MHww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Sweet"],
      rating: 4.7,
    },
    {
      id: 42,
      name: "Akara & Bread",
      category: "street",
      price: "₦800",
      prepTime: "15-20 mins",
      kitchen: "Street Bites",
      calories: 420,
      image: "https://images.unsplash.com/photo-1612504258838-fbf14fe4437d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGFrYXJhJTIwYmVhbnN8ZW58MXx8fHwxNzYxNzc1ODUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.8,
    },
    {
      id: 43,
      name: "Moi Moi",
      category: "street",
      price: "₦600",
      prepTime: "15-20 mins",
      kitchen: "Street Bites",
      calories: 280,
      image: "https://images.unsplash.com/photo-1637194502327-c99c94943680?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2klMjBtb2klMjBiZWFucyUyMHB1ZGRpbmd8ZW58MXx8fHwxNzYxNzc1ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Healthy"],
      rating: 4.7,
    },
    {
      id: 44,
      name: "Fried Plantain",
      category: "street",
      price: "₦700",
      prepTime: "10-15 mins",
      kitchen: "Street Bites",
      calories: 340,
      image: "https://images.unsplash.com/photo-1610886251108-db6a449ce6b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHBsYW50YWluJTIwZG9kb3xlbnwxfHx8fDE3NjE3NzU4NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Quick"],
      rating: 4.6,
    },
    {
      id: 45,
      name: "Boli (Roasted Plantain)",
      category: "street",
      price: "₦600",
      prepTime: "15-20 mins",
      kitchen: "Street Bites",
      calories: 290,
      image: "https://images.unsplash.com/photo-1610886251108-db6a449ce6b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHBsYW50YWluJTIwZG9kb3xlbnwxfHx8fDE3NjE3NzU4NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.8,
    },
    {
      id: 46,
      name: "Roasted Corn",
      category: "street",
      price: "₦500",
      prepTime: "15-20 mins",
      kitchen: "Street Bites",
      calories: 220,
      image: "https://images.unsplash.com/photo-1760322328049-91bb196d41d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdGVkJTIwY29ybiUyMHN0cmVldCUyMGZvb2R8ZW58MXx8fHwxNzYxNzc1ODU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Healthy"],
      rating: 4.5,
    },
    {
      id: 47,
      name: "Yam Porridge (Asaro)",
      category: "street",
      price: "₦1,800",
      prepTime: "25-30 mins",
      kitchen: "Mama's Pot Kitchen",
      calories: 480,
      image: "https://images.unsplash.com/photo-1612676855298-c7116c892b1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YW0lMjBlZ2clMjBzYXVjZSUyMGJyZWFrZmFzdHxlbnwxfHx8fDE3NjE3NzU4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.9,
    },
    {
      id: 48,
      name: "Suya Wrap",
      category: "street",
      price: "₦1,500",
      prepTime: "15-20 mins",
      kitchen: "Suya King",
      calories: 450,
      image: "https://images.unsplash.com/photo-1700135925872-1df223756392?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXlhJTIwbmlnZXJpYW4lMjBncmlsbGVkJTIwbWVhdHxlbnwxfHx8fDE3NjE3NzU4NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Quick"],
      rating: 4.7,
    },
    {
      id: 49,
      name: "Chin Chin",
      category: "street",
      price: "₦400",
      prepTime: "10-15 mins",
      kitchen: "Street Bites",
      calories: 260,
      image: "https://images.unsplash.com/photo-1665833613236-7c1d087463b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMHB1ZmYlMjBwdWZmfGVufDF8fHx8MTc2MTc3NTU1MHww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Snack"],
      rating: 4.6,
    },
    {
      id: 50,
      name: "Meat Pie",
      category: "street",
      price: "₦600",
      prepTime: "10-15 mins",
      kitchen: "Street Bites",
      calories: 380,
      image: "https://images.unsplash.com/photo-1733210438402-51d887628ff5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWF0JTIwcGllJTIwcGFzdHJ5fGVufDF8fHx8MTc2MTc3NTU1MHww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.7,
    },

    // BREAKFAST
    {
      id: 51,
      name: "Yam & Egg Sauce",
      category: "breakfast",
      price: "₦1,500",
      prepTime: "20-25 mins",
      kitchen: "Breakfast Hub",
      calories: 520,
      image: "https://images.unsplash.com/photo-1612676855298-c7116c892b1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YW0lMjBlZ2clMjBzYXVjZSUyMGJyZWFrZmFzdHxlbnwxfHx8fDE3NjE3NzU4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.8,
    },
    {
      id: 52,
      name: "Beans & Plantain",
      category: "breakfast",
      price: "₦1,200",
      prepTime: "25-30 mins",
      kitchen: "Breakfast Hub",
      calories: 480,
      image: "https://images.unsplash.com/photo-1612504258838-fbf14fe4437d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFucyUyMHBsYW50YWluJTIwbmlnZXJpYW58ZW58MXx8fHwxNzYxNzc2MzI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Healthy"],
      rating: 4.7,
    },
    {
      id: 53,
      name: "Akamu & Akara",
      category: "breakfast",
      price: "₦800",
      prepTime: "15-20 mins",
      kitchen: "Breakfast Hub",
      calories: 350,
      image: "https://images.unsplash.com/photo-1612504258838-fbf14fe4437d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGFrYXJhJTIwYmVhbnN8ZW58MXx8fHwxNzYxNzc1ODUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.6,
    },
    {
      id: 54,
      name: "Masa (Rice Cakes)",
      category: "breakfast",
      price: "₦600",
      prepTime: "15-20 mins",
      kitchen: "Northern Delights",
      calories: 320,
      image: "https://images.unsplash.com/photo-1649240437402-8e46a4cdf6c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGJyZWFrZmFzdCUyMGZvb2R8ZW58MXx8fHwxNzYxNzc2MzI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Northern"],
      rating: 4.5,
    },
    {
      id: 55,
      name: "Bread & Egg (Fried)",
      category: "breakfast",
      price: "₦900",
      prepTime: "10-15 mins",
      kitchen: "Breakfast Hub",
      calories: 420,
      image: "https://images.unsplash.com/photo-1727178392416-bd0a3639fbe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2clMjBzYW5kd2ljaCUyMGJyZWFrZmFzdHxlbnwxfHx8fDE3NjE3NzYzMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Quick"],
      rating: 4.7,
    },
    {
      id: 56,
      name: "Indomie (Special)",
      category: "breakfast",
      price: "₦1,000",
      prepTime: "10-15 mins",
      kitchen: "Quick Bites",
      calories: 450,
      image: "https://images.unsplash.com/photo-1649240437402-8e46a4cdf6c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGJyZWFrZmFzdCUyMGZvb2R8ZW58MXx8fHwxNzYxNzc2MzI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.6,
    },
    {
      id: 57,
      name: "Pancakes (Nigerian Style)",
      category: "breakfast",
      price: "₦1,200",
      prepTime: "15-20 mins",
      kitchen: "Breakfast Hub",
      calories: 480,
      image: "https://images.unsplash.com/photo-1636743713732-125909a35dcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5jYWtlcyUyMGJyZWFrZmFzdHxlbnwxfHx8fDE3NjE2NjQwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Sweet"],
      rating: 4.8,
    },
    {
      id: 58,
      name: "Custard & Milk",
      category: "breakfast",
      price: "₦700",
      prepTime: "10-15 mins",
      kitchen: "Breakfast Hub",
      calories: 340,
      image: "https://images.unsplash.com/photo-1649240437402-8e46a4cdf6c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGJyZWFrZmFzdCUyMGZvb2R8ZW58MXx8fHwxNzYxNzc2MzI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Light"],
      rating: 4.5,
    },
    {
      id: 59,
      name: "Oats & Fruits",
      category: "breakfast",
      price: "₦1,500",
      prepTime: "10-15 mins",
      kitchen: "FitMeal Lagos",
      calories: 380,
      image: "https://images.unsplash.com/photo-1632748441719-b62b3d01c48a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwZnJ1aXQlMjBoZWFsdGh5JTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MTc3NTg1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Healthy"],
      rating: 4.7,
    },
    {
      id: 60,
      name: "Egg Sandwich",
      category: "breakfast",
      price: "₦1,000",
      prepTime: "10-15 mins",
      kitchen: "Breakfast Hub",
      calories: 400,
      image: "https://images.unsplash.com/photo-1727178392416-bd0a3639fbe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2clMjBzYW5kd2ljaCUyMGJyZWFrZmFzdHxlbnwxfHx8fDE3NjE3NzYzMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Quick"],
      rating: 4.6,
    },

    // ADDITIONAL ITEMS TO REACH 100
    {
      id: 61,
      name: "Efo Elegusi Combo",
      category: "soups",
      price: "₦3,800",
      prepTime: "35-40 mins",
      kitchen: "Yoruba Delights",
      calories: 700,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Premium"],
      rating: 4.9,
    },
    {
      id: 62,
      name: "Fisherman Soup",
      category: "soups",
      price: "₦4,500",
      prepTime: "40-45 mins",
      kitchen: "Fish House",
      calories: 750,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Seafood"],
      rating: 4.8,
    },
    {
      id: 63,
      name: "Ofe Owerri",
      category: "soups",
      price: "₦3,700",
      prepTime: "35-40 mins",
      kitchen: "Igbo Kitchen",
      calories: 680,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.7,
    },
    {
      id: 64,
      name: "Ofe Onugbu (Bitter Leaf)",
      category: "soups",
      price: "₦3,600",
      prepTime: "35-40 mins",
      kitchen: "Igbo Kitchen",
      calories: 660,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.8,
    },
    {
      id: 65,
      name: "Miyan Kuka",
      category: "soups",
      price: "₦3,300",
      prepTime: "30-35 mins",
      kitchen: "Northern Delights",
      calories: 620,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Northern"],
      rating: 4.6,
    },
    {
      id: 66,
      name: "Miyan Taushe",
      category: "soups",
      price: "₦3,200",
      prepTime: "30-35 mins",
      kitchen: "Northern Delights",
      calories: 600,
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVndXNpJTIwc291cHxlbnwxfHx8fDE3NjE3NzU1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Northern"],
      rating: 4.7,
    },
    {
      id: 67,
      name: "Jollof Spaghetti",
      category: "rice",
      price: "₦2,500",
      prepTime: "25-30 mins",
      kitchen: "TasteBudz Kitchen",
      calories: 620,
      image: "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGpvbGxvZiUyMHJpY2V8ZW58MXx8fHwxNzYxMjQ0NDY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.8,
    },
    {
      id: 68,
      name: "Seafood Fried Rice",
      category: "rice",
      price: "₦3,500",
      prepTime: "30-35 mins",
      kitchen: "Fish House",
      calories: 680,
      image: "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGpvbGxvZiUyMHJpY2V8ZW58MXx8fHwxNzYxMjQ0NDY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Premium"],
      rating: 4.9,
    },
    {
      id: 69,
      name: "Party Jollof Rice",
      category: "rice",
      price: "₦3,000",
      prepTime: "30-35 mins",
      kitchen: "TasteBudz Kitchen",
      calories: 670,
      image: "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGpvbGxvZiUyMHJpY2V8ZW58MXx8fHwxNzYxMjQ0NDY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.9,
    },
    {
      id: 70,
      name: "Designer Rice",
      category: "rice",
      price: "₦3,200",
      prepTime: "30-35 mins",
      kitchen: "Yoruba Delights",
      calories: 690,
      image: "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGpvbGxvZiUyMHJpY2V8ZW58MXx8fHwxNzYxMjQ0NDY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Premium"],
      rating: 4.8,
    },
    {
      id: 71,
      name: "Nkwobi",
      category: "proteins",
      price: "₦3,800",
      prepTime: "30-35 mins",
      kitchen: "Igbo Kitchen",
      calories: 580,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.9,
    },
    {
      id: 72,
      name: "Isi Ewu (Goat Head)",
      category: "proteins",
      price: "₦4,500",
      prepTime: "40-45 mins",
      kitchen: "Igbo Kitchen",
      calories: 620,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Premium"],
      rating: 4.8,
    },
    {
      id: 73,
      name: "Ngwo Ngwo (Catfish)",
      category: "proteins",
      price: "₦4,200",
      prepTime: "35-40 mins",
      kitchen: "Fish House",
      calories: 560,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Spicy"],
      rating: 4.8,
    },
    {
      id: 74,
      name: "Smoked Catfish",
      category: "proteins",
      price: "₦3,500",
      prepTime: "30-35 mins",
      kitchen: "Fish House",
      calories: 420,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Seafood"],
      rating: 4.7,
    },
    {
      id: 75,
      name: "Point & Kill Fish",
      category: "proteins",
      price: "₦4,000",
      prepTime: "35-40 mins",
      kitchen: "Fish House",
      calories: 480,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Fresh"],
      rating: 4.9,
    },
    {
      id: 76,
      name: "Chicken Wings (Peppered)",
      category: "proteins",
      price: "₦2,500",
      prepTime: "25-30 mins",
      kitchen: "Grill Master",
      calories: 420,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.8,
    },
    {
      id: 77,
      name: "BBQ Chicken",
      category: "proteins",
      price: "₦3,000",
      prepTime: "30-35 mins",
      kitchen: "Grill Master",
      calories: 500,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Grilled"],
      rating: 4.8,
    },
    {
      id: 78,
      name: "Gizdodo (Gizzard & Plantain)",
      category: "street",
      price: "₦2,200",
      prepTime: "25-30 mins",
      kitchen: "Street Bites",
      calories: 520,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.9,
    },
    {
      id: 79,
      name: "Abacha (African Salad)",
      category: "street",
      price: "₦1,800",
      prepTime: "20-25 mins",
      kitchen: "Igbo Kitchen",
      calories: 420,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.7,
    },
    {
      id: 80,
      name: "Ugba (Ukpaka)",
      category: "street",
      price: "₦1,500",
      prepTime: "15-20 mins",
      kitchen: "Igbo Kitchen",
      calories: 360,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.6,
    },
    {
      id: 81,
      name: "Dodo (Fried Plantain)",
      category: "street",
      price: "₦800",
      prepTime: "10-15 mins",
      kitchen: "Street Bites",
      calories: 350,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Quick"],
      rating: 4.7,
    },
    {
      id: 82,
      name: "Sausage Roll",
      category: "street",
      price: "₦700",
      prepTime: "10-15 mins",
      kitchen: "Street Bites",
      calories: 420,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.6,
    },
    {
      id: 83,
      name: "Fish Pie",
      category: "street",
      price: "₦800",
      prepTime: "10-15 mins",
      kitchen: "Street Bites",
      calories: 440,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.7,
    },
    {
      id: 84,
      name: "Chicken Pie",
      category: "street",
      price: "₦700",
      prepTime: "10-15 mins",
      kitchen: "Street Bites",
      calories: 410,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Quick"],
      rating: 4.6,
    },
    {
      id: 85,
      name: "Scotch Egg",
      category: "street",
      price: "₦600",
      prepTime: "10-15 mins",
      kitchen: "Street Bites",
      calories: 380,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.7,
    },
    {
      id: 86,
      name: "Boiled Yam & Oil",
      category: "breakfast",
      price: "₦1,200",
      prepTime: "20-25 mins",
      kitchen: "Breakfast Hub",
      calories: 480,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Traditional"],
      rating: 4.6,
    },
    {
      id: 87,
      name: "Boiled Plantain & Fish",
      category: "breakfast",
      price: "₦1,600",
      prepTime: "20-25 mins",
      kitchen: "Breakfast Hub",
      calories: 520,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Healthy"],
      rating: 4.7,
    },
    {
      id: 88,
      name: "Irish Potato & Egg",
      category: "breakfast",
      price: "₦1,300",
      prepTime: "20-25 mins",
      kitchen: "Breakfast Hub",
      calories: 460,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.7,
    },
    {
      id: 89,
      name: "Fried Yam & Sauce",
      category: "breakfast",
      price: "₦1,400",
      prepTime: "20-25 mins",
      kitchen: "Breakfast Hub",
      calories: 540,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Popular"],
      rating: 4.8,
    },
    {
      id: 90,
      name: "Hausa Koko & Koose",
      category: "breakfast",
      price: "₦800",
      prepTime: "15-20 mins",
      kitchen: "Northern Delights",
      calories: 380,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Northern"],
      rating: 4.6,
    },
    {
      id: 91,
      name: "Fura Da Nono",
      category: "breakfast",
      price: "₦900",
      prepTime: "15-20 mins",
      kitchen: "Northern Delights",
      calories: 320,
      image: "https://images.unsplash.com/photo-1687422808248-f807f4ea2a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NjEyMjE1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Northern"],
      rating: 4.5,
    },

    // HEALTHY & VEGAN OPTIONS
    {
      id: 92,
      name: "Protein Power Bowl",
      category: "fit",
      price: "₦3,500",
      prepTime: "20-25 mins",
      kitchen: "FitMeal Lagos",
      calories: 450,
      image: "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXB8ZW58MXx8fHwxNzYxMTU1ODQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["High Protein"],
      rating: 4.9,
    },
    {
      id: 93,
      name: "Grilled Salmon Bowl",
      category: "fit",
      price: "₦4,200",
      prepTime: "25-30 mins",
      kitchen: "FitMeal Lagos",
      calories: 420,
      image: "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXB8ZW58MXx8fHwxNzYxMTU1ODQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Omega-3"],
      rating: 4.8,
    },
    {
      id: 94,
      name: "Quinoa & Chicken Bowl",
      category: "fit",
      price: "₦3,800",
      prepTime: "25-30 mins",
      kitchen: "FitMeal Lagos",
      calories: 480,
      image: "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXB8ZW58MXx8fHwxNzYxMTU1ODQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["High Protein"],
      rating: 4.7,
    },
    {
      id: 95,
      name: "Keto Meal Bowl",
      category: "fit",
      price: "₦4,000",
      prepTime: "25-30 mins",
      kitchen: "FitMeal Lagos",
      calories: 400,
      image: "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXB8ZW58MXx8fHwxNzYxMTU1ODQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Low Carb"],
      rating: 4.8,
    },
    {
      id: 96,
      name: "Lean Turkey Bowl",
      category: "fit",
      price: "₦3,600",
      prepTime: "25-30 mins",
      kitchen: "FitMeal Lagos",
      calories: 410,
      image: "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXB8ZW58MXx8fHwxNzYxMTU1ODQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["High Protein"],
      rating: 4.7,
    },
    {
      id: 97,
      name: "Vegan Buddha Bowl",
      category: "vegan",
      price: "₦3,200",
      prepTime: "15-20 mins",
      kitchen: "Green Bowl",
      calories: 380,
      image: "https://images.unsplash.com/photo-1680991307226-855ea16a3115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdhbiUyMG1lYWwlMjBib3dsfGVufDF8fHx8MTc2MTI0NDQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Vegan"],
      rating: 4.7,
    },
    {
      id: 98,
      name: "Coconut Quinoa Salad",
      category: "vegan",
      price: "₦2,900",
      prepTime: "15-20 mins",
      kitchen: "Green Bowl",
      calories: 350,
      image: "https://images.unsplash.com/photo-1680991307226-855ea16a3115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdhbiUyMG1lYWwlMjBib3dsfGVufDF8fHx8MTc2MTI0NDQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Gluten-Free"],
      rating: 4.7,
    },
    {
      id: 99,
      name: "Plant-Based Protein Bowl",
      category: "vegan",
      price: "₦3,400",
      prepTime: "20-25 mins",
      kitchen: "Green Bowl",
      calories: 390,
      image: "https://images.unsplash.com/photo-1680991307226-855ea16a3115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdhbiUyMG1lYWwlMjBib3dsfGVufDF8fHx8MTc2MTI0NDQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["High Protein"],
      rating: 4.8,
    },
    {
      id: 100,
      name: "Mediterranean Vegan Bowl",
      category: "vegan",
      price: "₦3,100",
      prepTime: "20-25 mins",
      kitchen: "Green Bowl",
      calories: 370,
      image: "https://images.unsplash.com/photo-1680991307226-855ea16a3115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdhbiUyMG1lYWwlMjBib3dsfGVufDF8fHx8MTc2MTI0NDQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Vegan"],
      rating: 4.7,
    },
  ];

  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className={`min-h-screen pt-20 transition-colors ${
      isWhiteBackground ? 'bg-white' : 'bg-gradient-to-br from-primary via-primary/95 to-primary/90'
    }`}>
      {/* Header */}
      <section className={`py-16 relative overflow-hidden transition-colors ${
        isWhiteBackground ? 'bg-white' : 'bg-gradient-to-br from-primary/0 via-primary/10 to-accent/10'
      }`}>
        {/* Decorative elements */}
        <div className={`absolute top-10 right-10 w-40 h-40 opacity-10 hidden lg:block transition-colors ${
          isWhiteBackground ? 'text-accent' : 'text-accent'
        }`}>
          <shapes.FoodBowl />
        </div>
        <div className={`absolute bottom-5 left-10 w-28 h-28 opacity-10 hidden lg:block transition-colors ${
          isWhiteBackground ? 'text-primary' : 'text-secondary'
        }`}>
          <shapes.Utensils />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] transition-colors ${
              isWhiteBackground ? 'text-primary dark:text-white' : 'text-white'
            }`}>
              Pick Your Meal.<br />We Go Deliver Am.
            </h1>
            <p className={`text-lg sm:text-xl leading-relaxed mb-6 transition-colors ${
              isWhiteBackground ? 'text-primary/70' : 'text-white/80'
            }`}>
              Fresh food from Lagos's best verified kitchens. Every meal is tasty and good for you.
            </p>
            <div className={`flex items-center justify-center gap-2 text-base transition-colors ${
              isWhiteBackground ? 'text-primary/60' : 'text-white/70'
            }`}>
              <Timer className="w-5 h-5 text-accent" />
              <span>30 minutes average delivery</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className={`py-6 sticky top-16 z-40 border-b transition-colors ${
        isWhiteBackground ? 'bg-white border-border' : 'bg-primary/80 backdrop-blur-md border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-[8px] mx-0 px-0 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory pt-[0px] pr-[16px] pl-[16px] m-[0px]">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-3 py-2 md:px-6 md:py-3 rounded-lg whitespace-nowrap transition-all text-sm md:text-base flex-shrink-0 snap-start ${
                  selectedCategory === category.id
                    ? isWhiteBackground
                      ? "bg-primary text-white shadow-lg"
                      : "bg-accent text-primary shadow-lg"
                    : isWhiteBackground
                      ? "bg-muted text-foreground hover:bg-muted/80"
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                }`}
              >
                {category.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-0 w-32 h-32 text-accent opacity-10">
          <shapes.Blob1 />
        </div>
        <div className="absolute top-1/2 right-0 w-36 h-36 text-primary opacity-10">
          <shapes.Leaf />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className={`overflow-hidden hover:shadow-2xl transition-all cursor-pointer group border-2 h-full flex flex-col ${
                    isWhiteBackground 
                      ? '' 
                      : 'bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10'
                  }`}>
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.tags.length > 0 && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-accent text-white border-0 shadow-lg">
                            {item.tags[0]}
                          </Badge>
                        </div>
                      )}
                      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/95 px-3 py-1.5 rounded-lg shadow-lg">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-foreground">{item.rating}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className={`text-xl font-extrabold mb-2 group-hover:text-primary transition-colors ${
                          isWhiteBackground ? 'text-foreground' : 'text-white'
                        }`}>
                          {item.name}
                        </h3>
                        <div className={`flex items-center gap-2 text-sm mb-3 transition-colors ${
                          isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                        }`}>
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{item.kitchen}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className={`flex items-center justify-between pt-4 border-t transition-colors ${
                        isWhiteBackground ? 'border-border' : 'border-white/20'
                      }`}>
                        <div className="text-2xl text-accent">{item.price}</div>
                        <div className={`flex items-center gap-1.5 transition-colors ${
                          isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                        }`}>
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{item.prepTime}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <motion.a
                        href={`https://wa.me/2349027231243?text=I want to order ${item.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg transition-all shadow-md ${
                          isWhiteBackground
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'bg-accent text-primary hover:bg-accent/90'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Order on WhatsApp</span>
                      </motion.a>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 relative overflow-hidden transition-colors ${
        isWhiteBackground ? 'bg-white' : 'bg-gradient-to-br from-primary via-primary/95 to-primary/90'
      }`}>
        {/* Decorative elements */}
        <div className="absolute top-1/3 left-5 w-24 h-24 text-accent opacity-20">
          <shapes.FoodBowl />
        </div>
        <div className={`absolute bottom-20 right-5 w-32 h-32 opacity-10 transition-colors ${
          isWhiteBackground ? 'text-primary' : 'text-secondary'
        }`}>
          <shapes.Utensils />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="relative inline-block">
              <div className={`absolute inset-0 -m-8 lg:-m-12 rounded-full blur-3xl transition-colors ${
                isWhiteBackground ? 'bg-primary/5' : 'bg-accent/10'
              }`}></div>
              <h2 className={`text-3xl lg:text-5xl font-extrabold mb-4 leading-tight relative transition-colors ${
                isWhiteBackground ? 'text-foreground' : 'text-white'
              }`}>
                What Our Customers Say
              </h2>
            </div>
            <p className={`text-lg sm:text-xl transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/80'
            }`}>
              Real food. Real reviews. Real satisfaction.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden mb-[100px] pt-[20px] pr-[0px] pb-[50px] pl-[0px] mt-[0px] mr-[0px] ml-[0px]">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -(440 * menuTestimonials.length)],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 32,
                ease: "linear",
              },
            }}
          >
            {/* Triple testimonials for seamless infinite scroll */}
            {[...menuTestimonials, ...menuTestimonials, ...menuTestimonials].map((testimonial, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-[340px] sm:w-[380px] lg:w-[420px] rounded-[36px] p-2 transition-colors ${
                  isWhiteBackground ? 'bg-primary/5' : 'bg-white/10'
                }`}
              >
                <Card className={`p-0 h-full border-[6px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)] transition-all duration-300 rounded-[32px] hover:scale-[1.02] overflow-hidden ${
                  isWhiteBackground ? 'border-primary bg-white' : 'border-accent/50 bg-white/5 backdrop-blur-md'
                }`}>
                  <div className="relative w-full h-[380px] overflow-hidden">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <Badge className="bg-accent text-primary border-0 px-4 py-1.5 rounded-full text-sm shadow-sm">
                        {testimonial.result}
                      </Badge>
                    </div>
                    <p className={`text-base mb-4 leading-relaxed min-h-[100px] transition-colors ${
                      isWhiteBackground ? 'text-foreground' : 'text-white'
                    }`}>
                      "{testimonial.quote}"
                    </p>
                    <div className={`pt-4 border-t-2 transition-colors ${
                      isWhiteBackground ? 'border-border/50' : 'border-white/20'
                    }`}>
                      <div className={`mb-1 transition-colors ${
                        isWhiteBackground ? 'text-foreground' : 'text-white'
                      }`}>{testimonial.name}</div>
                      <div className={`text-sm transition-colors ${
                        isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                      }`}>{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-primary relative overflow-hidden">
        {/* Decorative layered green shapes */}
        <div className="absolute inset-0 w-full h-full">
          <shapes.GreenLayers2 />
        </div>
        <div className="absolute top-10 left-10 w-28 h-28 text-accent opacity-25">
          <shapes.StarBurst />
        </div>
        <div className="absolute bottom-10 right-10 w-32 h-32 text-accent opacity-20">
          <shapes.Plate />
        </div>
        {/* Food illustrations */}
        <div className="absolute top-1/4 right-6 sm:right-16 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 text-accent opacity-22">
          <shapes.Plantain />
        </div>
        <div className="absolute top-16 sm:top-32 left-1/4 w-14 sm:w-16 lg:w-20 h-14 sm:h-16 lg:h-20 text-accent opacity-18">
          <shapes.Tomato />
        </div>
        <div className="absolute bottom-1/3 left-4 sm:left-12 w-18 sm:w-22 lg:w-26 h-18 sm:h-22 lg:h-26 text-accent opacity-20">
          <shapes.ChickenLeg />
        </div>
        <div className="absolute bottom-12 sm:bottom-24 right-1/4 w-16 sm:w-18 lg:w-22 h-16 sm:h-18 lg:h-22 text-accent opacity-18">
          <shapes.Rice />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 -m-8 lg:-m-12 bg-accent/10 rounded-full blur-3xl"></div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6 leading-tight relative">
              Can't Find What You Want?
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
            Just tell us. We'll find it, cook it, and deliver it. Simple.
          </p>
          <a
            href="https://wa.me/2349027231243"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <span className="text-lg">Chat with Us</span>
          </a>
        </div>
      </section>
    </div>
  );
}
