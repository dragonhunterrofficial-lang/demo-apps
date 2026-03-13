document.addEventListener('DOMContentLoaded', () => {
  const tool = document.body.dataset.tool;

  const setResult = (id, msg) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = msg;
  };

  if (tool === 'age-calculator') {
    document.getElementById('calcAge')?.addEventListener('click', () => {
      const dob = new Date(document.getElementById('dob').value);
      if (Number.isNaN(dob.getTime())) return setResult('ageResult', 'Please select a valid birth date.');
      const now = new Date();
      let years = now.getFullYear() - dob.getFullYear();
      let months = now.getMonth() - dob.getMonth();
      if (months < 0 || (months === 0 && now.getDate() < dob.getDate())) years--;
      months = (months + 12) % 12;
      setResult('ageResult', `You are <strong>${years}</strong> years and <strong>${months}</strong> months old.`);
    });
  }

  if (tool === 'bmi-calculator') {
    document.getElementById('calcBmi')?.addEventListener('click', () => {
      const h = parseFloat(document.getElementById('height').value) / 100;
      const w = parseFloat(document.getElementById('weight').value);
      if (!h || !w) return setResult('bmiResult', 'Enter valid height and weight.');
      const bmi = (w / (h * h)).toFixed(1);
      const status = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
      setResult('bmiResult', `Your BMI is <strong>${bmi}</strong> (${status}).`);
    });
  }

  if (tool === 'password-generator') {
    document.getElementById('genPass')?.addEventListener('click', () => {
      const len = Math.max(6, parseInt(document.getElementById('passLen').value || '12', 10));
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
      let out = '';
      for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
      setResult('passResult', `Generated password: <code>${out}</code>`);
    });
  }

  if (tool === 'love-calculator') {
    document.getElementById('calcLove')?.addEventListener('click', () => {
      const a = document.getElementById('nameA').value.trim();
      const b = document.getElementById('nameB').value.trim();
      if (!a || !b) return setResult('loveResult', 'Enter both names.');
      const seed = [...(a + b)].reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const score = (seed * 7) % 101;
      setResult('loveResult', `<strong>${score}%</strong> compatibility between ${a} and ${b}.`);
    });
  }

  if (tool === 'random-name-generator') {
    const names = ['Astra', 'Nova', 'Rex', 'Pixel', 'Blaze', 'Zenith', 'Echo', 'Onyx', 'Luna', 'Vortex'];
    document.getElementById('genName')?.addEventListener('click', () => {
      setResult('nameResult', `Suggested name: <strong>${names[Math.floor(Math.random() * names.length)]}</strong>`);
    });
  }

  if (tool === 'text-counter') {
    const text = document.getElementById('textInput');
    const update = () => {
      const value = text.value;
      const words = value.trim() ? value.trim().split(/\s+/).length : 0;
      setResult('textResult', `Characters: <strong>${value.length}</strong> | Words: <strong>${words}</strong>`);
    };
    text?.addEventListener('input', update);
    update();
  }

  if (tool === 'unit-converter') {
    document.getElementById('convertUnit')?.addEventListener('click', () => {
      const v = parseFloat(document.getElementById('unitValue').value);
      const t = document.getElementById('unitType').value;
      if (Number.isNaN(v)) return setResult('unitResult', 'Enter a numeric value.');
      const results = {
        kmmi: `${v} km = ${(v * 0.621371).toFixed(3)} miles`,
        mikm: `${v} miles = ${(v / 0.621371).toFixed(3)} km`,
        kglt: `${v} kg = ${(v * 2.20462).toFixed(3)} lb`,
        lbkg: `${v} lb = ${(v / 2.20462).toFixed(3)} kg`
      };
      setResult('unitResult', results[t]);
    });
  }

  if (tool === 'qr-generator') {
    document.getElementById('genQr')?.addEventListener('click', () => {
      const data = encodeURIComponent(document.getElementById('qrText').value.trim());
      if (!data) return setResult('qrResult', 'Enter text or URL first.');
      setResult('qrResult', `<img alt="Generated QR" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${data}">`);
    });
  }

  if (tool === 'random-number') {
    document.getElementById('genNum')?.addEventListener('click', () => {
      const min = parseInt(document.getElementById('minNum').value || '1', 10);
      const max = parseInt(document.getElementById('maxNum').value || '100', 10);
      if (min > max) return setResult('numResult', 'Min value cannot be greater than max value.');
      const n = Math.floor(Math.random() * (max - min + 1)) + min;
      setResult('numResult', `Random number: <strong>${n}</strong>`);
    });
  }

  if (tool === 'color-picker') {
    document.getElementById('pickColor')?.addEventListener('input', (e) => {
      const hex = e.target.value;
      setResult('colorResult', `Selected color: <strong>${hex}</strong><div style="height:44px;border-radius:8px;margin-top:.5rem;border:1px solid #334155;background:${hex};"></div>`);
    });
    document.getElementById('pickColor')?.dispatchEvent(new Event('input'));
  }
});
