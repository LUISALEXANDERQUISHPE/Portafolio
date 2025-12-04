# Configuración de EmailJS para el Formulario de Contacto

## Paso 1: Crear cuenta en EmailJS

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Regístrate con tu email (es gratis hasta 200 emails/mes)
3. Verifica tu email

## Paso 2: Conectar tu servicio de email

1. En el dashboard, ve a **Email Services**
2. Haz clic en **Add New Service**
3. Selecciona tu proveedor (Gmail recomendado):
   - Gmail
   - Outlook
   - Yahoo
   - Otro SMTP
4. Conecta tu cuenta siguiendo las instrucciones
5. Copia el **Service ID** (ejemplo: `service_abc123`)

## Paso 3: Crear un template de email

1. Ve a **Email Templates**
2. Haz clic en **Create New Template**
3. Edita el template con este contenido:

**Subject:**
```
Nuevo mensaje de contacto de {{from_name}}
```

**Content:**
```
Has recibido un nuevo mensaje desde tu portafolio:

Nombre: {{from_name}}
Email: {{from_email}}

Mensaje:
{{message}}

---
Este mensaje fue enviado desde el formulario de contacto de tu portafolio.
```

4. Guarda y copia el **Template ID** (ejemplo: `template_xyz789`)

## Paso 4: Obtener tu Public Key

1. Ve a **Account** → **General**
2. Copia tu **Public Key** (ejemplo: `AbCdEfGhIjKlMnOp`)

## Paso 5: Actualizar el código

Abre el archivo `components/sections/contact.tsx` y reemplaza:

```typescript
await emailjs.send(
  'YOUR_SERVICE_ID',        // <- Reemplaza con tu Service ID
  'YOUR_TEMPLATE_ID',       // <- Reemplaza con tu Template ID
  {
    from_name: formData.name,
    from_email: formData.email,
    message: formData.message,
    to_name: 'Luis Alexander Quishpe',
  },
  'YOUR_PUBLIC_KEY'          // <- Reemplaza con tu Public Key
)
```

Por ejemplo:
```typescript
await emailjs.send(
  'service_abc123',
  'template_xyz789',
  {
    from_name: formData.name,
    from_email: formData.email,
    message: formData.message,
    to_name: 'Luis Alexander Quishpe',
  },
  'AbCdEfGhIjKlMnOp'
)
```

## Paso 6: Variables de entorno (Opcional pero recomendado)

Para mayor seguridad, puedes usar variables de entorno:

1. Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc123
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xyz789
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=AbCdEfGhIjKlMnOp
```

2. Actualiza el código en `contact.tsx`:

```typescript
await emailjs.send(
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
  {
    from_name: formData.name,
    from_email: formData.email,
    message: formData.message,
    to_name: 'Luis Alexander Quishpe',
  },
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
)
```

3. Asegúrate de que `.env.local` esté en tu `.gitignore`

## ¡Listo!

Ahora cuando alguien envíe el formulario de contacto, recibirás un email directamente en tu bandeja de entrada.

## Ventajas de EmailJS:

✅ Sin backend necesario
✅ Gratis hasta 200 emails/mes
✅ Fácil de configurar
✅ Protección anti-spam incluida
✅ Funciona con Gmail, Outlook, etc.

## Alternativas:

Si prefieres otras opciones:
- **Formspree**: https://formspree.io/
- **Web3Forms**: https://web3forms.com/
- **GetForm**: https://getform.io/
