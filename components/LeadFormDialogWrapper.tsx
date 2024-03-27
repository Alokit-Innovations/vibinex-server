import { PropsWithChildren } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogTrigger
} from "./Dialog";
import * as Form from '@radix-ui/react-form';
import Button from "./Button";

const LeadFormDialogWrapper = ({ children }: PropsWithChildren) => {
	const isPersonalEmail = (email: string) => {
		const personalDomains = [
			'@gmail.com',
			'@yahoo.com',
			'@hotmail.com',
			'@protonmail.com',
			'@outlook.com',
			'@icloud.com',
			'@mail.com',
			'@live.com',
			'@me.com',
			'@hushmail.com',
			'@aim.com',
			'@inbox.com',
			'@qq.com',
			'@naver.com',
			'@yahoo.co.jp',
			'@rediffmail.com',
			'@yahoo.co.in',
			'@trashmail.com',
			'@guerrillamail.com',
			'@sharklasers.com'
		];
		return personalDomains.some(domain => email.endsWith(domain));
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md text-primary-text">
				<DialogHeader>
					<DialogTitle>Request a callback</DialogTitle>
					<DialogDescription>
						We will understand your needs and advice you on how to get started.
					</DialogDescription>
				</DialogHeader>
				<Form.Root className="w-full">
					<Form.Field className="grid mb-[10px]" name="Name">
						<div className="flex items-baseline justify-between">
							<Form.Label className="text-[15px] font-medium leading-[35px]">Your Name</Form.Label>
							<Form.Message className="text-[13px] opacity-[0.8]" match="valueMissing">
								Please enter your full name
							</Form.Message>
						</div>
						<Form.Control asChild>
							<input
								className="box-border w-full bg-black/10 shadow-black/40 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-black/40"
								type="text"
								required
							/>
						</Form.Control>
					</Form.Field>
					<Form.Field className="grid mb-[10px]" name="Email">
						<div className="flex items-baseline justify-between">
							<Form.Label className="text-[15px] font-medium leading-[35px]">Company Email</Form.Label>
							<Form.Message className="text-[13px] opacity-[0.8]" match="valueMissing">
								Please enter your email
							</Form.Message>
							<Form.Message className="text-[13px] opacity-[0.8]" match="typeMismatch">
								Please provide a valid email
							</Form.Message>
							<Form.Message className="text-[13px] opacity-[0.8]" match={(email) => isPersonalEmail(email)}>
								Please do not provide a personal email
							</Form.Message>
						</div>
						<Form.Control asChild>
							<input
								className="box-border w-full bg-black/10 shadow-black/40 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_white] focus:shadow-[0_0_0_2px_white] selection:color-white selection:bg-black/40"
								type="email"
								required
							/>
						</Form.Control>
					</Form.Field>
					<Form.Field className="grid mb-[10px]" name="Phone">
						<div className="flex items-baseline justify-between">
							<Form.Label className="text-[15px] font-medium leading-[35px]">Mobile Number</Form.Label>
							<Form.Message className="text-[13px] opacity-[0.8]" match="valueMissing">
								Please enter your mobile number
							</Form.Message>
							<Form.Message className="text-[13px] opacity-[0.8]" match="typeMismatch">
								Please provide a valid phone number
							</Form.Message>
						</div>
						<Form.Control asChild>
							<input
								className="box-border w-full bg-black/10 shadow-black/40 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-black/40"
								type="tel"
								required
							/>
						</Form.Control>
					</Form.Field>
					<Form.Field className="grid mb-[10px]" name="question">
						<div className="flex items-baseline justify-between">
							<Form.Label className="text-[15px] font-medium leading-[35px]">
								Estimate number of PRs merged per week (optional)
							</Form.Label>
							<Form.Message className="text-[13px] opacity-[0.8]" match="valueMissing">
								Please enter a round number
							</Form.Message>
						</div>
						<Form.Control asChild>
							<input
								className="box-border w-full bg-black/10 shadow-black/40 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-black/40"
								type="number"
							/>
						</Form.Control>
					</Form.Field>
					<Form.Submit asChild>
						<Button variant="contained" className="w-full mt-2 py-3 font-medium text-lg leading-none shadow-white/20 focus:shadow-[0_0_0_2px] focus:shadow-primary-text focus:outline-none">
							Submit
						</Button>
					</Form.Submit>
				</Form.Root>
				<DialogFooter>
					<small>Protected by reCAPTCHA. Google Privacy Policy & Terms of Service apply</small>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default LeadFormDialogWrapper;