'use client'
import Image from "next/image"

export default function Home() {

	return (
		<div>
			<h1>SRKW</h1>
			<Image 
				src='/images/srkw-all-pods.svg' 
				alt='srkw network'
				width='500' height='300'
			/>
		</div>
	)
}
