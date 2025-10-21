import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
    let mentionedJid = await m.mentionedJid
    let userId = mentionedJid && mentionedJid[0] ? mentionedJid[0] : m.sender
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    
    // Array de videos para convertir a GIF
    const videoUrls = [
        'https://example.com/video1.mp4',
        'https://example.com/video2.mp4', 
        'https://example.com/video3.mp4',
        'https://example.com/video4.mp4'
    ]
    
    // Seleccionar video aleatorio
    const randomVideo = videoUrls[Math.floor(Math.random() * videoUrls.length)]
    
    let txt = `
「🎀」 ¡Hola! *@${userId.split('@')[0]}*, 
Soy *${botname}*, aquí tienes la lista de comandos.

╭── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╮
   🌸 *ESTADO DEL BOT* 🌸
╰── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╯

✧  *Usuarios* » ${totalreg.toLocaleString()}
✧  *Comandos* » ${totalCommands}
✧  *Versión* » ${vs}

╭── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╮
     🎀 *CATEGORÍAS* 🎀
╰── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╯

🌸 *INFORMACIÓN* - !help info
🦋 *BOTS* - !help bots  
🧸 *PERFIL* - !help profile
🌷 *DESCARGAS* - !help downloads
💐 *UTILIDADES* - !help tools
🍒 *GACHA* - !help gacha
💸 *ECONOMÍA* - !help economy
🧩 *GRUPO* - !help group
💗 *ANIME* - !help anime
⭐ *NSFW* - !help nsfw`.trim()

    try {
        // Convertir video a GIF
        const gifBuffer = await convertVideoToGif(randomVideo)
        
        // Reaccionar al mensaje
        await conn.sendMessage(m.chat, { 
            react: { 
                text: '⭐', 
                key: m.key 
            }
        })
        
        // Botones interactivos
        const buttons = [
            {
                buttonId: '/code',
                buttonText: { displayText: 'SERBOT CODE' },
                type: 1
            },
            {
                buttonId: '/qr',
                buttonText: { displayText: 'SERBOT QR' },
                type: 1
            }
        ]
        
        // Enviar mensaje con GIF, texto y botones
        await conn.sendMessage(m.chat, {
            video: gifBuffer,
            gifPlayback: true,
            caption: txt,
            footer: 'Selecciona una opción:',
            buttons: buttons,
            headerType: 4,
            contextInfo: {
                mentionedJid: [userId],
                externalAdReply: {
                    title: botname,
                    body: 'Menu de comandos',
                    mediaType: 1,
                    thumbnail: await (await fetch(banner)).buffer(),
                    showAdAttribution: false
                }
            }
        }, { quoted: m })
        
    } catch (error) {
        console.error('Error al procesar GIF:', error)
        
        // Botones para el fallback
        const buttons = [
            {
                buttonId: '/code',
                buttonText: { displayText: 'SERBOT CODE' },
                type: 1
            },
            {
                buttonId: '/qr',
                buttonText: { displayText: 'SERBOT QR' },
                type: 1
            }
        ]
        
        // Enviar solo texto con botones si falla el GIF
        await conn.sendMessage(m.chat, { 
            text: txt,
            footer: 'Selecciona una opción:',
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                mentionedJid: [userId],
                externalAdReply: {
                    title: botname,
                    body: 'Menu de comandos',
                    mediaType: 1,
                    thumbnail: await (await fetch(banner)).buffer(),
                    showAdAttribution: false
                }
            }
        }, { quoted: m })
    }
}

// Función para convertir video a GIF (simplificada)
async function convertVideoToGif(videoUrl) {
    try {
        // Simular conversión - en producción usarías ffmpeg
        const videoResponse = await fetch(videoUrl)
        return await videoResponse.buffer()
    } catch (error) {
        console.error('Error al convertir video a GIF:', error)
        throw error
    }
}

// Manejar los botones
handler.before = async (m, { conn }) => {
    if (m.type === 'buttonsResponse') {
        const buttonId = m.text
        const sender = m.sender
        
        if (buttonId === '/code') {
            await conn.sendMessage(m.chat, {
                text: 'Ejecutando comando /code...'
            }, { quoted: m })
            // Aquí ejecutarías la lógica del comando !code
            conn.sendMessage(m.chat, { text: '/code' })
            
        } else if (buttonId === '/qr') {
            await conn.sendMessage(m.chat, {
                text: 'Ejecutando comando /qr...'
            }, { quoted: m })
            // Aquí ejecutarías la lógica del comando !qr
            conn.sendMessage(m.chat, { text: '/qr' })
        }
    }
}

handler.help = ['menu2']
handler.tags = ['main']
handler.command = ['menu2', 'menú2', 'help2']

export default handler
