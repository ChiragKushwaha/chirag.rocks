import { render } from '@testing-library/react';
import Home from '@/app/page';

describe('Home', () => {
  it('renders hello world', () => {
    const { getByText } = render(<Home />);
    expect(getByText('Hello World!')).toBeInTheDocument();
  });
});
