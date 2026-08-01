"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  collegeName: z.string().min(2, "College name must be at least 2 characters."),
  academicYear: z.string().min(4, "Enter a valid academic year (e.g. 2026-2027)"),
  workingDays: z.string(),
  periodsPerDay: z.string(),
})

export function CollegeSetupWizard() {
  const [activeTab, setActiveTab] = useState("general")
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collegeName: "",
      academicYear: "2026-2027",
      workingDays: "5",
      periodsPerDay: "8",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Handle form submission logic here
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">1. General Info</TabsTrigger>
        <TabsTrigger value="departments">2. Departments</TabsTrigger>
        <TabsTrigger value="schedule">3. Timings & Rules</TabsTrigger>
      </TabsList>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Enter the basic details about your institution.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="collegeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Stanford University" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="academicYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Year</FormLabel>
                      <FormControl>
                        <Input placeholder="2026-2027" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" onClick={() => setActiveTab("departments")}>Next Step</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle>Departments & Courses</CardTitle>
                <CardDescription>Add the departments that need timetables.</CardDescription>
              </CardHeader>
              <CardContent className="h-48 flex items-center justify-center border border-dashed rounded-md m-6">
                 <p className="text-slate-500 text-sm">Department configuration list (UI pending)</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setActiveTab("general")}>Previous</Button>
                <Button type="button" onClick={() => setActiveTab("schedule")}>Next Step</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Timings & Constraints</CardTitle>
                <CardDescription>Configure working days, periods, and lunch breaks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="workingDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Working Days Per Week</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="periodsPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Periods Per Day</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setActiveTab("departments")}>Previous</Button>
                <Button type="submit">Complete Setup</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  )
}
