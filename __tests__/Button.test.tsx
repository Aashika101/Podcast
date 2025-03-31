import React from 'react';
import { render, screen } from '@testing-library/react';

import { describe, it, expect } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button component', () => {
  it('renders the button with the correct label', () => {
    render(<Button variant="default" size="default">Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
  });
});