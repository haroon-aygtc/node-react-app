// [build] library: 'shadcn'
import { Badge } from "@/components/ui/badge";

const meta = {
  title: "ui/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {},
};
export default meta;

export const Base = {
  render: (args: any) => <Badge {...args}>Badge</Badge>,
  args: {},
};
export const Secondary = {
  render: (args: any) => <Badge {...args}>Secondary</Badge>,
  args: {
    variant: "secondary",
  },
};
export const Outline = {
  render: (args: any) => <Badge {...args}>Outline</Badge>,
  args: {
    variant: "outline",
  },
};
export const Destructive = {
  render: (args: any) => <Badge {...args}>Destructive</Badge>,
  args: {
    variant: "destructive",
  },
};

export const Fallback = {
  render: () => <Badge className="bg-slate-500 dark:bg-slate-800">Badge</Badge>,
  args: {},
};

export const WithIcon = {
  render: (args: any) => <Badge {...args}>With Icon</Badge>,
  args: {},
};

