import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define the schema for guest registration
const guestRegistrationSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
});

type GuestRegistrationData = z.infer<typeof guestRegistrationSchema>;

interface GuestRegistrationProps {
  onRegister: (data: GuestRegistrationData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const GuestRegistration = ({
  onRegister,
  isLoading = false,
  error = null,
}: GuestRegistrationProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestRegistrationData>({
    resolver: zodResolver(guestRegistrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: GuestRegistrationData) => {
    try {
      await onRegister(data);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Welcome to our Chat</h3>
        <p className="text-sm text-gray-500">
          Please register to start chatting with our AI assistant
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            {...register("fullName")}
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            placeholder="Enter your phone number"
            {...register("phone")}
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Start Chatting"
          )}
        </Button>
      </form>

      <p className="text-xs text-center text-gray-500 mt-4">
        By registering, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default GuestRegistration;
