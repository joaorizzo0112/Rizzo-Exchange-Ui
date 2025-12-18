document.addEventListener('DOMContentLoaded', () => {
    const amountEl = document.getElementById('amount');
    const currencyOneEl = document.getElementById('currency-one');
    const currencyTwoEl = document.getElementById('currency-two');
    const resultEl = document.getElementById('result');
    const rateEl = document.getElementById('rate-display');
    const symbolOneEl = document.getElementById('symbol-one');
    const symbolTwoEl = document.getElementById('symbol-two');
    const langSelect = document.getElementById('lang-select');

    const ISO_DATA = [
        { code: "USD", symbol: "$", pt: "Dólar Americano", en: "US Dollar", es: "Dólar", fr: "Dollar", it: "Dollaro", ar: "دولار" },
        { code: "EUR", symbol: "€", pt: "Euro", en: "Euro", es: "Euro", fr: "Euro", it: "Euro", ar: "يورو" },
        { code: "GBP", symbol: "£", pt: "Libra Esterlina", en: "British Pound", es: "Libra", fr: "Livre", it: "Sterlina", ar: "جنيه" },
        { code: "JPY", symbol: "¥", pt: "Iene Japonês", en: "Japanese Yen", es: "Yen", fr: "Yen", it: "Yen", ar: "ين" },
        { code: "AUD", symbol: "$", pt: "Dólar Australiano", en: "Australian Dollar", es: "Dólar", fr: "Dollar", it: "Dollaro", ar: "دولار" },
        { code: "CAD", symbol: "$", pt: "Dólar Canadense", en: "Canadian Dollar", es: "Dólar", fr: "Dollar", it: "Dollaro", ar: "دولار" },
        { code: "CHF", symbol: "CHF", pt: "Franco Suíço", en: "Swiss Franc", es: "Franco", fr: "Franc", it: "Franco", ar: "فرنك" },
        { code: "CNY", symbol: "¥", pt: "Yuan Chinês", en: "Chinese Yuan", es: "Yuan", fr: "Yuan", it: "Yuan", ar: "يوان" },
        { code: "BRL", symbol: "R$", pt: "Real Brasileiro", en: "Brazilian Real", es: "Real", fr: "Réal", it: "Real", ar: "ريال" },
        { code: "INR", symbol: "₹", pt: "Rupia Indiana", en: "Indian Rupee", es: "Rupia", fr: "Roupie", it: "Rupia", ar: "روبية" }
    ];

    const TRANSLATIONS = {
        pt: { title: "CONVERSOR", sub: "TAXAS ISO", de: "DE", para: "PARA", menu: "Português" },
        en: { title: "CONVERTER", sub: "ISO RATES", de: "FROM", para: "TO", menu: "English" },
        es: { title: "CONVERSOR", sub: "TASAS ISO", de: "DE", para: "PARA", menu: "Español" },
        fr: { title: "CONVERTISSEUR", sub: "TAUX ISO", de: "DE", para: "À", menu: "Français" },
        it: { title: "CONVERTITORE", sub: "TASSI ISO", de: "DA", para: "A", menu: "Italiano" },
        ar: { title: "محول", sub: "أسعار ISO 4217", de: "من", para: "إلى", menu: "العربية" }
    };

    function render() {
        const lang = langSelect.value || 'pt';
        const t = TRANSLATIONS[lang];

        document.getElementById('ui-title').innerText = t.title;
        document.getElementById('ui-subtitle').innerText = t.sub;
        document.getElementById('label-from').innerText = t.de;
        document.getElementById('label-to').innerText = t.para;
        document.body.style.direction = (lang === 'ar') ? 'rtl' : 'ltr';

        if (langSelect.innerHTML === "") {
            langSelect.innerHTML = Object.keys(TRANSLATIONS).map(l => `<option value="${l}">${TRANSLATIONS[l].menu}</option>`).join('');
        }

        const cur1 = currencyOneEl.value || "BRL";
        const cur2 = currencyTwoEl.value || "USD";
        const options = ISO_DATA.map(c => `<option value="${c.code}">${c.code}</option>`).join('');
        
        currencyOneEl.innerHTML = options;
        currencyTwoEl.innerHTML = options;
        currencyOneEl.value = cur1;
        currencyTwoEl.value = cur2;

        updateVisuals();
    }

    function updateVisuals() {
        const data1 = ISO_DATA.find(i => i.code === currencyOneEl.value);
        const data2 = ISO_DATA.find(i => i.code === currencyTwoEl.value);
        symbolOneEl.innerText = data1.symbol;
        symbolTwoEl.innerText = data2.symbol;
        calculate();
    }

    async function calculate() {
        const from = currencyOneEl.value;
        const to = currencyTwoEl.value;
        const val = parseFloat(amountEl.value) || 0;

        try {
            const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
            const data = await res.json();
            const rate = data.rates[to];
            rateEl.innerText = `1 ${from} = ${rate.toFixed(4)} ${to}`;
            
            let finalVal = (val * rate).toLocaleString(undefined, { minimumFractionDigits: 2 });
            resultEl.innerText = finalVal;
            resultEl.style.fontSize = finalVal.length > 15 ? "1.3rem" : "2.2rem";
        } catch (e) { rateEl.innerText = "Erro de Sincronização"; }
    }

    langSelect.addEventListener('change', render);
    [amountEl, currencyOneEl, currencyTwoEl].forEach(el => el.addEventListener('input', updateVisuals));
    document.getElementById('swap').addEventListener('click', () => {
        const tmp = currencyOneEl.value;
        currencyOneEl.value = currencyTwoEl.value;
        currencyTwoEl.value = tmp;
        updateVisuals();
    });

    render();
});