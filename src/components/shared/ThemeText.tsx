"use client";

import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

export function ThemeTest() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-primary">Theme Test Component</h1>

      {/* Color Palette */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Primary</CardTitle>
              <div className="h-20 bg-primary rounded-md"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-primary/80 rounded-md mb-2"></div>
              <div className="h-8 bg-primary/60 rounded-md mb-2"></div>
              <div className="h-8 bg-primary/40 rounded-md"></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secondary</CardTitle>
              <div className="h-20 bg-secondary rounded-md"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-secondary/80 rounded-md mb-2"></div>
              <div className="h-8 bg-secondary/60 rounded-md mb-2"></div>
              <div className="h-8 bg-secondary/40 rounded-md"></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accent</CardTitle>
              <div className="h-20 bg-accent rounded-md"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-accent/80 rounded-md mb-2"></div>
              <div className="h-8 bg-accent/60 rounded-md mb-2"></div>
              <div className="h-8 bg-accent/40 rounded-md"></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Muted</CardTitle>
              <div className="h-20 bg-muted rounded-md"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted/80 rounded-md mb-2"></div>
              <div className="h-8 bg-muted/60 rounded-md mb-2"></div>
              <div className="h-8 bg-muted/40 rounded-md"></div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Component Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Component Examples</h2>
        <div className="space-y-4">
          <div className="space-x-4">
            <Button variant="default">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Card Example</CardTitle>
              <CardDescription>
                This is how our cards will look with the current theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Content using muted foreground color
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
