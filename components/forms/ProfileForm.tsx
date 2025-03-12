"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileBasicSchema,
  ProfileBasicInput,
  profilePasswordSchema,
  ProfilePasswordInput,
} from "@/schemas/profile";
import { useAuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton"; // Make sure this exists

export function ProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { user, loading } = useAuthContext();
  const { toast } = useToast();
  const { updateProfile, signIn } = useAuth();

  // Basic Info Form
  const {
    register: registerBasic,
    handleSubmit: handleSubmitBasic,
    formState: { errors: errorsBasic },
    reset: resetBasic,
  } = useForm<ProfileBasicInput>({
    resolver: zodResolver(profileBasicSchema),
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm<ProfilePasswordInput>({
    resolver: zodResolver(profilePasswordSchema),
  });

  // Prefill basic info once user data is loaded
  useEffect(() => {
    if (user && !loading) {
      resetBasic({
        firstName: user.user_metadata?.firstName ?? "",
        lastName: user.user_metadata?.lastName ?? "",
        email: user.email ?? "",
      });
    }
  }, [user, loading, resetBasic]);

  // Handle basic info submit
  async function onSubmitBasic(data: ProfileBasicInput) {
    if (!user) return;
    try {
      const { error } = await updateProfile({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      if (error) {
        toast({
          title: "Error updating profile",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile updated",
          description: "Your basic info has been saved!",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error updating profile",
        description: err.message,
        variant: "destructive",
      });
    }
  }

  // Handle password submit
  async function onSubmitPassword(data: ProfilePasswordInput) {
    if (!user) return;
    try {
      // Verify current password
      const { error: signInError } = await signIn(
        user.email!,
        data.currentPassword
      );
      if (signInError) {
        return toast({
          title: "Current password is incorrect",
          description: signInError.message,
          variant: "destructive",
        });
      }

      // Update only the password
      const { error } = await updateProfile({
        email: user.email || "",
        password: data.newPassword,
      });
      if (error) {
        toast({
          title: "Error changing password",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password changed",
          description: "Your password has been updated successfully!",
        });
        resetPassword();
      }
    } catch (err: any) {
      toast({
        title: "Error changing password",
        description: err.message,
        variant: "destructive",
      });
    }
  }

  // ----------------------------------------
  // SKELETON LOADING STATE
  // ----------------------------------------
  if (loading) {
    return (
      <div className={className} {...props}>
        {/* Basic Information Skeleton */}
        <section className="grid items-start gap-8 md:grid-cols-3">
          {/* LEFT COLUMN: Heading & Description */}
          <div className="md:col-span-1 space-y-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* RIGHT COLUMN: Skeleton Form */}
          <div className="md:col-span-2">
            <div className="max-w-lg space-y-4">
              {/* Each field label + input */}
              <div>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Save button */}
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Change Password Skeleton */}
        <section className="grid items-start gap-8 md:grid-cols-3">
          {/* LEFT COLUMN: Heading & Description */}
          <div className="md:col-span-1 space-y-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* RIGHT COLUMN: Skeleton Form */}
          <div className="md:col-span-2">
            <div className="max-w-lg space-y-4">
              <div>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Save button */}
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ----------------------------------------
  // MAIN RENDER IF NOT LOADING
  // ----------------------------------------
  if (!user) {
    return <p>You must be signed in to view this page.</p>;
  }

  return (
    <div className={className} {...props}>
      {/* Basic Information Section */}
      <section className="grid items-start gap-8 md:grid-cols-3">
        {/* LEFT COLUMN: Heading & Description */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold">Basic information</h2>
          <p className="text-sm text-muted-foreground mt-2">
            View and update your personal details and account information.
          </p>
        </div>

        {/* RIGHT COLUMN: Form with max-w */}
        <div className="md:col-span-2">
          <div className="max-w-lg">
            <form
              onSubmit={handleSubmitBasic(onSubmitBasic)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...registerBasic("firstName")} />
                {errorsBasic.firstName && (
                  <p className="text-red-500 text-sm">
                    {errorsBasic.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...registerBasic("lastName")} />
                {errorsBasic.lastName && (
                  <p className="text-red-500 text-sm">
                    {errorsBasic.lastName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerBasic("email")}
                  disabled
                />
                {errorsBasic.email && (
                  <p className="text-red-500 text-sm">
                    {errorsBasic.email.message}
                  </p>
                )}
              </div>
              <Button type="submit">Save</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Separator */}
      <Separator className="my-8" />

      {/* Change Password Section */}
      <section className="grid items-start gap-8 md:grid-cols-3">
        {/* LEFT COLUMN: Heading & Description */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold">Change password</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Update your password to keep your account secure.
          </p>
        </div>

        {/* RIGHT COLUMN: Form with max-w */}
        <div className="md:col-span-2">
          <div className="max-w-lg">
            <form
              onSubmit={handleSubmitPassword(onSubmitPassword)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="currentPassword">Verify current password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...registerPassword("currentPassword")}
                />
                {errorsPassword.currentPassword && (
                  <p className="text-red-500 text-sm">
                    {errorsPassword.currentPassword.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...registerPassword("newPassword")}
                />
                {errorsPassword.newPassword && (
                  <p className="text-red-500 text-sm">
                    {errorsPassword.newPassword.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmNewPassword">Confirm password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  {...registerPassword("confirmNewPassword")}
                />
                {errorsPassword.confirmNewPassword && (
                  <p className="text-red-500 text-sm">
                    {errorsPassword.confirmNewPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit">Save</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
