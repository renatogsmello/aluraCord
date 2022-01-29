import { Box, Text, TextField, Image, Button } from "@skynexui/components"
import React from "react"
import appConfig from "../config.json"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/router"
import { ButtonSendSticker } from "../src/components/ButtonSendSticker"

const SUPABA_ANON_KEY =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyOTAzNCwiZXhwIjoxOTU4OTA1MDM0fQ.wcoibuwpu2UV5INmgHGgyhDUoQN1chA_Raw7BJ9eY5k"

const SUPABASE_URL = "https://vfbfazdbrwbzfqxregul.supabase.co"
const supabaseClient = createClient(SUPABASE_URL, SUPABA_ANON_KEY)

function escutaMensagemDoServidor(adicionaMensagem) {
	return supabaseClient
		.from("mensagens")
		.on("INSERT", (respostaLive) => {
			adicionaMensagem(respostaLive.new)
		})
		.subscribe()
}

export default function ChatPage() {
	const [mensagem, setMensagem] = React.useState("")
	const [listaMensagens, setListaMensagens] = React.useState([])

	const roteamento = useRouter()
	const usuarioLogado = roteamento.query.username

	// Atualiza os dados quando quando recebe uma nova mensagem

	React.useEffect(() => {
		supabaseClient
			.from("mensagens")
			.select("*")
			.order("id", { ascending: false })
			.then(({ data }) => {
				setListaMensagens(data)
			})

		escutaMensagemDoServidor((novaMensagem) => {
			//handleNovaMensagem(novaMensagem)
			setListaMensagens((valorAtualDaLista) => {
				return [novaMensagem, ...valorAtualDaLista]
			})
		})
	}, [])

	function handleNovaMensagem(novaMensagem) {
		const mensagem = {
			//id: listaMensagens.length + 1,
			texto: novaMensagem,
			de: usuarioLogado,
		}
		// Salva a mensagem no banco
		supabaseClient
			.from("mensagens")
			.insert([mensagem])
			.then(({ data }) => {})
		// Limpa o campo de mensagem
		setMensagem("")
	}

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
							// Guarda o valor da mensagem
							onChange={(event) => {
								const valor = event.target.value
								setMensagem(valor)
							}}
							// Quando a tecla enter for pressionada a mensagem é enviada pra função handleNovaMensagem
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
						<ButtonSendSticker
							onStickerClick={(sticker) => {
								console.log("[usando o componente]salve esse sticker por favor", sticker)
								handleNovaMensagem(`:sticker: ${sticker}`)
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

						{mensagemConteudo.texto.startsWith(":sticker:") ? (
							<Image src={mensagemConteudo.texto.replace(":sticker:", "")} />
						) : (
							mensagemConteudo.texto
						)}
						{/* {mensagemConteudo.texto} */}
					</Text>
				)
			})}
		</Box>
	)
}
