import pt from "@/messages/pt.json"
import en from "@/messages/en.json"

export function getTexts(locale: string) {
  return locale === "en" ? en : pt
}
