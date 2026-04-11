You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
bg-pattern.tsx
import React from 'react';
import { cn } from '@/lib/utils';

type BGVariantType = 'dots' | 'diagonal-stripes' | 'grid' | 'horizontal-lines' | 'vertical-lines' | 'checkerboard';
type BGMaskType =
	| 'fade-center'
	| 'fade-edges'
	| 'fade-top'
	| 'fade-bottom'
	| 'fade-left'
	| 'fade-right'
	| 'fade-x'
	| 'fade-y'
	| 'none';

type BGPatternProps = React.ComponentProps<'div'> & {
	variant?: BGVariantType;
	mask?: BGMaskType;
	size?: number;
	fill?: string;
};

const maskClasses: Record<BGMaskType, string> = {
	'fade-edges': '[mask-image:radial-gradient(ellipse_at_center,var(--background),transparent)]',
	'fade-center': '[mask-image:radial-gradient(ellipse_at_center,transparent,var(--background))]',
	'fade-top': '[mask-image:linear-gradient(to_bottom,transparent,var(--background))]',
	'fade-bottom': '[mask-image:linear-gradient(to_bottom,var(--background),transparent)]',
	'fade-left': '[mask-image:linear-gradient(to_right,transparent,var(--background))]',
	'fade-right': '[mask-image:linear-gradient(to_right,var(--background),transparent)]',
	'fade-x': '[mask-image:linear-gradient(to_right,transparent,var(--background),transparent)]',
	'fade-y': '[mask-image:linear-gradient(to_bottom,transparent,var(--background),transparent)]',
	none: '',
};

function geBgImage(variant: BGVariantType, fill: string, size: number) {
	switch (variant) {
		case 'dots':
			return `radial-gradient(${fill} 1px, transparent 1px)`;
		case 'grid':
			return `linear-gradient(to right, ${fill} 1px, transparent 1px), linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
		case 'diagonal-stripes':
			return `repeating-linear-gradient(45deg, ${fill}, ${fill} 1px, transparent 1px, transparent ${size}px)`;
		case 'horizontal-lines':
			return `linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
		case 'vertical-lines':
			return `linear-gradient(to right, ${fill} 1px, transparent 1px)`;
		case 'checkerboard':
			return `linear-gradient(45deg, ${fill} 25%, transparent 25%), linear-gradient(-45deg, ${fill} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${fill} 75%), linear-gradient(-45deg, transparent 75%, ${fill} 75%)`;
		default:
			return undefined;
	}
}

const BGPattern = ({
	variant = 'grid',
	mask = 'none',
	size = 24,
	fill = '#252525',
	className,
	style,
	...props
}: BGPatternProps) => {
	const bgSize = `${size}px ${size}px`;
	const backgroundImage = geBgImage(variant, fill, size);

	return (
		<div
			className={cn('absolute inset-0 z-[-10] size-full', maskClasses[mask], className)}
			style={{
				backgroundImage,
				backgroundSize: bgSize,
				...style,
			}}
			{...props}
		/>
	);
};

BGPattern.displayName = 'BGPattern';
export { BGPattern };


demo.tsx
import { BGPattern } from "@/components/ui/bg-pattern";

export default function DemoOne() {
	return (
		<div className="mx-auto max-w-4xl space-y-5 p-8">
			<div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border-2">
				<BGPattern variant="grid" mask="fade-edges" />
				<h2 className="text-3xl font-bold">Grid Background</h2>
				<p className="text-muted-foreground font-mono">With (fade-edges) Mask</p>
			</div>
			<div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border-2">
				<BGPattern variant="dots" mask="fade-center" />
				<h2 className="text-3xl font-bold">Dots Background</h2>
				<p className="text-muted-foreground font-mono">With (fade-center) Mask</p>
			</div>
			<div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border-2">
				<BGPattern variant="diagonal-stripes" mask="fade-y" />
				<h2 className="text-3xl font-bold">Diagonal Stripes</h2>
				<p className="text-muted-foreground font-mono">With (fade-y) Mask</p>
			</div>
			<div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border-2">
				<BGPattern variant="horizontal-lines" mask="fade-right" />
				<h2 className="text-3xl font-bold">Horizontal Lines</h2>
				<p className="text-muted-foreground font-mono">With (fade-right) Mask</p>
			</div>
			<div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border-2">
				<BGPattern variant="vertical-lines" mask="fade-bottom" />
				<h2 className="text-3xl font-bold">Vertical Lines</h2>
				<p className="text-muted-foreground font-mono">With (fade-bottom) Mask</p>
			</div>
			<div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border-2">
				<BGPattern variant="checkerboard" mask="fade-top" />
				<h2 className="text-3xl font-bold">Checkerboard Background</h2>
				<p className="text-muted-foreground font-mono">With (fade-top) Mask</p>
			</div>
		</div>
	);
}

```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
