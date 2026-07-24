# Referências Bíblicas — versão com *a Bíblia para Todos*

Este pacote é uma **demonstração privada**, para apreciação da Sociedade Bíblica de Portugal. Mostra uma ferramenta que faz aparecer o texto bíblico ao passar o rato (ou tocar, no telemóvel) sobre referências como *João 3:16* em qualquer página — encontrando-as sozinha, sem que seja preciso marcá-las à mão.

## Ver a demonstração

Abra **`demonstracao-bpt.html`** com duplo-clique. É um ficheiro único, funciona sem internet e sem instalar nada. Passe o rato sobre as referências a azul.

(A pasta `dist/` e `dados/` contém a mesma coisa na forma como ficaria num site real: uma linha de `<script>` a apontar para um ficheiro de dados — ver `index.html`, que precisa de um servidor local.)

## O que é vosso e o que é livre

- O **código** da ferramenta é de código aberto (licença MIT). Está publicado para uso livre em: *(link do repositório público, sem a BPT)*.
- O **texto** que aqui aparece é *a Bíblia para Todos*, Edição Comum, © Sociedade Bíblica de Portugal, 1993, 2009 — usado com autorização, apenas para esta demonstração. **Não** está no repositório público.

Se a SBP quiser publicar isto no seu site, ou disponibilizá-lo a outros, o texto da BPT fica sempre alojado e controlado por vós; a ferramenta apenas o mostra.

## Nota sobre a versificação

Este texto foi extraído do PDF da BPT só para demonstrar. Para uma publicação a sério a partir da vossa edição digital, há duas particularidades a decidir:

- **Salmos** — a BPT segue a numeração grega/vulgata (o Salmo 23 protestante é o 22 na BPT). A maioria dos sites em português usa a numeração protestante. É preciso decidir qual seguir e gerar o ficheiro de dados em conformidade.
- **Joel** — 3 ou 4 capítulos, conforme a edição.

A ferramenta lida com ambas as convenções; é só uma questão de como o ficheiro de dados é gerado.

## Contacto

Ferramenta criada para o site da Igreja Evangélica de Livramento (www.iel.pt).
