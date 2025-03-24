import { render } from '@testing-library/react';
import Home from '@/app/page';

describe('Home', () => {
  it('renders hello world', () => {
    const { getByText } = render(<Home />);
    const helloWorldElement = getByText('Hello World!');
    expect(helloWorldElement).toBeInTheDocument();
  });
});
