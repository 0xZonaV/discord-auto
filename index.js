import readline from 'readline-sync';
import {readFileSync} from 'fs';
import {Client } from 'discord.js-selfbot-v13';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Чтение файла с токенами и прокси
const content = readFileSync('tokens.txt', 'utf8');
const tokensAndProxies = content.split(/\r?\n/);
// Создание клиентов Discord для каждого токена
const clients = await Promise.all(tokensAndProxies.map(async (tokenAndProxy) => {
    const [token, ip, port, username, password,] = tokenAndProxy.split(':');

    const proxy = `socks5://${username}:${password}@${ip}:${port}`;

    console.log(proxy);

    const client = new Client({
        captchaService: '2captcha',
        captchaKey: 'YOUR CAPTCHA KEY',
        checkUpdate: false,
        captchaRetryLimit: 25,
        proxy: proxy
    });
    await client.login(token);
    return client;
}));


clients.map((client) => console.log(client.user.tag));

const JoinServer = async () => {

    const inviteLink = readline.question('Invite link: ');
    await Promise.all(clients.map(client => {
        return client.acceptInvite(inviteLink);
    }));
    console.log('Вход выполнен на всех серверах');
}

const WriteMessage = async () => {
    // Написать сообщение
    const channelId = readline.question('Channel ID: ');
    const messageContent = readline.question('Message Content: ');
    await Promise.all(clients.map(async (client, index) => {
        await new Promise(resolve => setTimeout(resolve, 2000 * index));
        const channel = client.channels.cache.get(channelId);
        return channel.send(messageContent)
            .catch(console.error);
    }));
    console.log('Сообщение отправлено на всех каналах');
}

const ReactMessage = async () => {
    // Поставить реакцию на сообщение
    const channelId = readline.question('Channel ID: ');
    const messageId = readline.question('Message ID: ');
    await Promise.all(clients.map(async (client, index) => {
        await new Promise(resolve => setTimeout(resolve, 2000 * index));
        const channel = client.channels.cache.get(channelId);
        return channel.messages.fetch(messageId)
            .then(message => message.react('❤️'))
            .catch(console.error);
    }));
}

/*// Обработчик команд пользователя
const handleUserInput = async (input) => {
    if (input === '1') {
        // Войти на сервер по ссылке
        const inviteLink = 'https://discord.gg/invite-link-here';
        await Promise.all(clients.map(client => {
            return client.acceptInvite(inviteLink);
        }));
        console.log('Вход выполнен на всех серверах');
    } else if (input === '2') {
        // Поставить реакцию на сообщение
        const channelId = '1234567890'; // ID канала, где находится сообщение
        const messageId = '123456789012345678'; // ID сообщения, на которое нужно поставить реакцию
        await Promise.all(clients.map(client => {
            const channel = client.channels.cache.get(channelId);
            return channel.messages.fetch(messageId)
                .then(message => message.react('❤️'))
                .catch(console.error);
        }));
        console.log('Реакция установлена на всех сообщениях');
    } else if (input === '3') {
        // Написать сообщение
        const channelId = '1234567890'; // ID канала, куда нужно отправить сообщение
        const messageContent = 'Привет, я бот!'; // Текст сообщения
        await Promise.all(clients.map(client => {
            const channel = client.channels.cache.get(channelId);
            return channel.send(messageContent)
                .catch(console.error);
        }));
        console.log('Сообщение отправлено на всех каналах');
    } else {
        console.log('Неправильный ввод, попробуйте еще раз');
    }
};*/


while (true) {
    console.log('----------------Main Functions----------------');
    console.log('1. Accept Invite');
    console.log('2. Write Message');
    console.log('3. React to message');
    console.log(' ');
    console.log('---------------------------------------------');
    console.log('14. Exit');

    const choice = readline.question('Choose menu number: ');

    switch (parseInt(choice)) {
        case 1:
            await JoinServer();
            break;

        case 2:
            await WriteMessage();
            break;

        case 3:
            await ReactMessage();
            break;

        case 4:
            console.log('Exiting...');
            process.exit(0)
            break;

        default:
            console.log('Invalid choice.');
            break;
    }

}


