import { styled } from '@mui/material/styles';

export const MainContent = (props: { children: any }) => {

	return (
		<>
			<div style={{ paddingTop: "8px" }}>
				{props.children}
			</div>
		</>
	)
}