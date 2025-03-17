import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PromptBuilder } from "@/components/prompts/PromptBuilder";

describe("PromptBuilder Component", () => {
  test("renders PromptBuilder component", () => {
    console.log("Test: renders PromptBuilder component");
    render(
      <PromptBuilder
        onSave={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    const element = screen.getByTestId("prompt-builder");
    expect(element).toBeInTheDocument();
  });

  test("handles input change", () => {
    render(
      <PromptBuilder
        onSave={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    const input = screen.getByLabelText("Prompt Input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "New Prompt" } });
    expect(input.value).toBe("New Prompt");
  });

  test("submits the form", () => {
    const handleSubmit = jest.fn();
    render(<PromptBuilder onSave={handleSubmit} />);
    const button = screen.getByText("Submit");
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalled();
  });
});
