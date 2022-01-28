import { Box, Text, TextField, Image, Button } from "@skynexui/components"
import React from "react"
import appConfig from "../config.json"
import { createClient } from "@supabase/supabase-js"

const SUPABA_ANON_KEY =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyOTAzNCwiZXhwIjoxOTU4OTA1MDM0fQ.wcoibuwpu2UV5INmgHGgyhDUoQN1chA_Raw7BJ9eY5k"

const SUPABASE_URL = "https://vfbfazdbrwbzfqxregul.supabase.co"
const supabaseClient = createClient(SUPABASE_URL, SUPABA_ANON_KEY)

export default function ChatPage() {
	// Sua lógica vai aqui
	const [mensagem, setMensagem] = React.useState("")
	const [listaMensagens, setListaMensagens] = React.useState([])

	React.useEffect(() => {
		supabaseClient
			.from("mensagens")
			.select("*")
			.order("id", { ascending: false })
			.then(({ data }) => {
				setListaMensagens(data)
			})
	}, [])

	function handleNovaMensagem(novaMensagem) {
		const mensagem = {
			//id: listaMensagens.length + 1,
			texto: novaMensagem,
			de: "renatogsmello",
		}
		supabaseClient
			.from("mensagens")
			.insert([mensagem])
			.then(({ data }) => {
				console.log(data)
				setListaMensagens([data[0], ...listaMensagens])
			})
		// setListaMensagens([mensagem, ...listaMensagens])
		setMensagem("")
	}
	// ./Sua lógica vai aqui
	return (
		<Box
			styleSheet={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: appConfig.theme.colors.primary[500],
				backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundBlendMode: "multiply",
				color: appConfig.theme.colors.neutrals["000"],
			}}
		>
			<Box
				styleSheet={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
					borderRadius: "5px",
					backgroundColor: appConfig.theme.colors.neutrals[700],
					height: "100%",
					maxWidth: "95%",
					maxHeight: "95vh",
					padding: "32px",
				}}
			>
				<Header />
				<Box
					styleSheet={{
						position: "relative",
						display: "flex",
						flex: 1,
						height: "80%",
						backgroundColor: appConfig.theme.colors.neutrals[600],
						flexDirection: "column",
						borderRadius: "5px",
						padding: "16px",
					}}
				>
					<MessageList mensagens={listaMensagens} />

					<Box
						as="form"
						styleSheet={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<TextField
							value={mensagem}
							onChange={(event) => {
								const valor = event.target.value
								setMensagem(valor)
							}}
							onKeyPress={(event) => {
								if (event.key === "Enter") {
									event.preventDefault()
									handleNovaMensagem(mensagem)
								}
							}}
							placeholder="Insira sua mensagem aqui..."
							type="textarea"
							styleSheet={{
								width: "100%",
								border: "0",
								resize: "none",
								borderRadius: "5px",
								padding: "6px 8px",
								backgroundColor: appConfig.theme.colors.neutrals[800],
								marginRight: "12px",
								color: appConfig.theme.colors.neutrals[200],
							}}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

function Header() {
	return (
		<>
			<Box styleSheet={{ width: "100%", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Text variant="heading5">Chat</Text>
				<Button variant="tertiary" colorVariant="neutral" label="Logout" href="/" />
			</Box>
		</>
	)
}

function MessageList(props) {
	return (
		<Box
			tag="ul"
			styleSheet={{
				overflow: "scroll",
				display: "flex",
				flexDirection: "column-reverse",
				flex: 1,
				color: appConfig.theme.colors.neutrals["000"],
				marginBottom: "16px",
			}}
		>
			{props.mensagens.map((mensagemConteudo) => {
				return (
					<Text
						tag="li"
						key={mensagemConteudo.id}
						styleSheet={{
							borderRadius: "5px",
							padding: "6px",
							marginBottom: "12px",
							hover: {
								backgroundColor: appConfig.theme.colors.neutrals[700],
							},
						}}
					>
						<Box
							styleSheet={{
								marginBottom: "8px",
							}}
						>
							<Image
								styleSheet={{
									width: "20px",
									height: "20px",
									borderRadius: "50%",
									display: "inline-block",
									marginRight: "8px",
								}}
								src={`https://github.com/${mensagemConteudo.de}.png`}
							/>
							<Text tag="strong">{mensagemConteudo.de}</Text>
							<Text
								styleSheet={{
									fontSize: "10px",
									marginLeft: "8px",
									color: appConfig.theme.colors.neutrals[300],
								}}
								tag="span"
							>
								{new Date().toLocaleDateString()}
							</Text>
						</Box>
						{mensagemConteudo.texto}
					</Text>
				)
			})}
		</Box>
	)
}
