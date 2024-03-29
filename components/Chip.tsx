"use client";

import Image from 'next/image';

interface ChipProps {
	avatar: string;
	name: string;
	disabled: boolean;
}

const Chip: React.FC<ChipProps> = ({ name, avatar, disabled = false }) => (
	<div
		className={`flex items-center space-x-1 outline outline-1 outline-slate-500 rounded-full py-1 px-3 m-1 ${disabled ? 'opacity-50 bg-action-inactive' : ''}`}
		title={disabled ? 'This auth has expired' : ''}
	>
		<Image
			src={avatar}
			alt={`${name}'s avatar`}
			width={24} height={24} className="h-6 rounded-full"
		/>
		<span className="text-md">{name}</span>
	</div>
);

export default Chip;
