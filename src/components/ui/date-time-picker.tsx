"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateTimePickerProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
    const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(date)

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            // Preserve time if it exists
            if (selectedDateTime) {
                selectedDate.setHours(selectedDateTime.getHours())
                selectedDate.setMinutes(selectedDateTime.getMinutes())
            }
            setSelectedDateTime(selectedDate)
            setDate(selectedDate)
        }
    }

    const handleTimeChange = (type: "hour" | "minute", value: string) => {
        if (selectedDateTime) {
            const newDateTime = new Date(selectedDateTime)
            if (type === "hour") {
                newDateTime.setHours(parseInt(value))
            } else {
                newDateTime.setMinutes(parseInt(value))
            }
            setSelectedDateTime(newDateTime)
            setDate(newDateTime)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP p") : <span>Pick a date and time</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDateTime}
                    onSelect={handleDateSelect}
                    initialFocus
                />
                <div className="p-3 border-t border-border">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0"
                            max="23"
                            value={selectedDateTime?.getHours() || 0}
                            onChange={(e) => handleTimeChange("hour", e.target.value)}
                            className="w-16 px-2 py-1 text-sm bg-background border border-input rounded-md"
                        />
                        <span>:</span>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={selectedDateTime?.getMinutes() || 0}
                            onChange={(e) => handleTimeChange("minute", e.target.value)}
                            className="w-16 px-2 py-1 text-sm bg-background border border-input rounded-md"
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
