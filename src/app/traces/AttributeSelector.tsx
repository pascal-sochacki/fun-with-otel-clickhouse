"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export interface KeyValue {
  key: string;
  value: string;
}

export function AttributeSelector(props: {
  setSelectedAttributes: (args: KeyValue) => void;
}) {
  const [selectedKey, setSelectedKey] = React.useState<string>();
  const [selectedValue, setSelectedValue] = React.useState<string>();
  const keys = api.traces.getAttributeKeys.useQuery();
  const values = api.traces.getAttributeValuesForKey.useQuery(
    selectedKey ?? "",
  );
  function reset() {
    setSelectedValue(undefined);
    setSelectedKey(undefined);
  }
  return (
    <div className="flex gap-2 p-2 pl-0">
      <ComboboxDemo
        label="Attribute"
        items={keys.data ?? []}
        value={selectedKey}
        setValue={setSelectedKey}
      />
      <ComboboxDemo
        label="Value"
        items={values.data ?? []}
        value={selectedValue}
        setValue={setSelectedValue}
      />
      <Button
        onClick={() => {
          if (selectedKey && selectedValue) {
            props.setSelectedAttributes({
              key: selectedKey,
              value: selectedValue,
            });
          }
        }}
      >
        OK
      </Button>
      <Button
        variant={"destructive"}
        onClick={() => {
          reset();
        }}
      >
        Reset
      </Button>
    </div>
  );
}

export function ComboboxDemo(props: {
  label: string;
  items: string[];
  value?: string;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between overflow-hidden"
        >
          {props.value
            ? props.items.find((framework) => framework === props.value)
            : `Select ${props.label}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${props.label}...`} />
          <CommandList>
            <CommandEmpty>No {props.label} found.</CommandEmpty>
            <CommandGroup>
              {props.items.map((framework) => (
                <CommandItem
                  key={framework}
                  value={framework}
                  onSelect={(currentValue) => {
                    props.setValue(
                      currentValue === props.value ? "" : currentValue,
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      props.value === framework ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {framework}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
