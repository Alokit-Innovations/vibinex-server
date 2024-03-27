import React from "react";
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import Button from "../components/Button";
import RudderContext from "../components/RudderContext";
import { getAndSetAnonymousIdFromLocalStorage } from "../utils/rudderstack_initialize";
import { getAuthUserId, getAuthUserName } from "../utils/auth";
import ProviderLogo from "../components/ProviderLogo";
import LeadFormDialogWrapper from "../components/LeadFormDialogWrapper";

const Hero = (props: { ctaLink: string }) => {
	const { rudderEventMethods } = React.useContext(RudderContext);
	const session: Session | null = useSession().data;

	React.useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()
		// Track the "Get Started" event
		const handleCTAClick = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Primary CTA clicked", { type: "button", eventStatusFlag: 1, source: "landing-hero", name: getAuthUserName(session) }, anonymousId)
		};

		// Track the "Book Demo" event
		const handleBookDemo = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Book demo button", { type: "button", eventStatusFlag: 1, source: "landing-hero", name: getAuthUserName(session) }, anonymousId)
		};

		const primaryCTAButton = document.getElementById('cta-btn');
		const bookDemoButton = document.getElementById('book-demo-btn');

		primaryCTAButton?.addEventListener('click', handleCTAClick);
		bookDemoButton?.addEventListener('click', handleBookDemo);

		return () => {
			primaryCTAButton?.removeEventListener('click', handleCTAClick);
			bookDemoButton?.removeEventListener('click', handleBookDemo);
		};
	}, [rudderEventMethods, session]);

	return (
		<div className='flex items-center justify-center h-fit bg-black'>
			<section className='p-5 text-primary-light my-auto pt-1 md:w-2/3 xl:w-1/2 text-center'>
				<h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 mt-8'>{'Merge PRs with'}
					<span className='text-primary-main font-bold block'>Confidence</span>
				</h1>
				<p className="text-xl sm:text-2xl text-gray-300">
					Auto-assign the <span className="text-primary-main">right reviewers</span>, highlight code <span className="text-primary-main">relevant to you</span>, and boost collaboration to ship <span className="text-primary-main">3x faster</span>.
				</p>
				<div className="w-full flex space-x-4 my-5">
					<Button id="cta-btn" variant="contained" href={props.ctaLink} className='text-center w-[45%] p-3 sm:p-4 px-20 rounded-lg font-bold text-[20px] sm:text-[25px]'>
						Get Started
					</Button>
					<LeadFormDialogWrapper>
						<Button id="book-demo-btn" variant="outlined" className='text-center w-[45%] sm:p-4 p-3 px-20 rounded-lg font-bold sm:text-[25px] text-[20px]'>
							Book demo
						</Button>
					</LeadFormDialogWrapper>
				</div>
				<p className="text-lg sm:text-lg mb-10 text-gray-300" title="100% privacy & data protection">
					Your code <span className="text-primary-main">never leaves your systems</span> by design
				</p>
				<div className="my-10 w-full relative">
					{/*Overlay*/}
					<div className='absolute bg-black/50 z-10 h-full w-full' />
					<p>Supported Providers:</p>
					<div className="flex gap-4 mt-2 justify-center">
						<ProviderLogo provider="github" theme="light" className="w-10 h-12" />
						<ProviderLogo provider="bitbucket" theme="dark" className="w-10 h-12" />
					</div>
				</div>
			</section>
		</div>
	)
}
export default Hero;
