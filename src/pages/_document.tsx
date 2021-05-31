// <Html>, <Head>, <Main>, <Nextscript>: tags para renderização da página.

import Document, { Html, Head, Main, NextScript } from 'next/document'; // importação de hooks do React, que permitem aumentar as aplicações <html> e <body>

export default class MyDocument extends Document {
    render(){
        return(
            <Html>
                <Head>
                <link rel = "preconnect" href = "https://fonts.gstatic.com"/> {/*fonte do Google*/}
                <link href = "https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet"/> {/*fonte do Google*/}
                <link rel = "shortcut icon" href = "favicon.png" type="image/png"/> {/*logo do Podcastr*/}            
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}