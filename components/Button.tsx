import { ButtonHTMLAttributes, MouseEventHandler, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<{
	variant: 'contained' | 'text' | 'outlined',
	href?: string,
	target?: string,
	onClick?: MouseEventHandler,
	disabled?: boolean,
	className?: string,
	id?: string,
	ref?: React.ForwardedRef<HTMLButtonElement>,
	isNotBasic?: boolean,
}> & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: ButtonProps) => {
	const { variant, href, onClick, disabled, id, target, className, children, ref, isNotBasic, ...otherProps } = props;
	const clickBehaviour: MouseEventHandler = (event) => {
		const targetVal = (target) ?? '_self';
		if (href) {
			window.open(href, targetVal);
		}
		else if (onClick) {
			onClick(event);
		}
	}
	const basicClass = 'inline-flex items-center justify-center relative cursor-pointer align-middle disabled:cursor-default box-border min-w-max py-1 px-4 rounded-md transition-all ';
	const variantClasses = {
		'contained': "bg-primary-main text-secondary-main disabled:bg-action-inactive disabled:hover:bg-transparent hover:bg-primary-main/80 hover:text-secondary-main/80 ",
		'outlined': "border-secondary-main text-secondary-main border-2 rounded hover:border-secondary-main/80 hover:text-secondary-main/80 ",
		'text': "",
	}

	return (
		<button ref={ref} id={id} onClick={clickBehaviour} disabled={disabled}
			className={(isNotBasic ? '' : basicClass) + variantClasses[variant] + className}
			{...otherProps}>
			<span className="w-full font-semibold">
				{children}
			</span>
		</button>
	)
}

export default Button;