import en from "@/messages/en.json"
import pt from "@/messages/pt.json"

export const messages = {
  en,
  pt,
}

export type Locale = "pt" | "en"

export function getMessages(locale: Locale) {
  return messages[locale] ?? messages.pt
}
