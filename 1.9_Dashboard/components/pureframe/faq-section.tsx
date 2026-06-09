"use client"
import { ChevronRight } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
interface FAQ {
  question: string
  answer: string
}
interface FAQSectionProps {
  locationName: string
  faqs?: FAQ[]
}
export function FAQSection({ locationName, faqs }: FAQSectionProps) {
  const defaultFaqs: FAQ[] = [
    {
      question: `What is the range of housing prices in ${locationName}?`,
      answer: `Housing prices in ${locationName} vary based on the type of property, location, and amenities. You can find options starting from budget-friendly apartments to premium luxury homes. Use Pureframe Labs to check actual registered transaction prices.`,
    },
    {
      question: `How is the infrastructure in ${locationName}?`,
      answer: `${locationName} has a well-developed infrastructure with schools, colleges, hospitals, and healthcare facilities nearby, making it convenient for families.`,
    },
    {
      question: `Which new projects will offer possession in ${locationName}?`,
      answer: `Several new projects in ${locationName} are expected to offer possession in the coming year. Check the project listings for specific possession dates and RERA registration status.`,
    },
    {
      question: `Which projects in ${locationName} are ready to move?`,
      answer: `There are multiple ready-to-move projects available in ${locationName}. Filter the listings to find projects with immediate possession availability.`,
    },
    {
      question: `Which are the affordable projects in ${locationName}?`,
      answer: `${locationName} offers various affordable housing options across different budget ranges. Use actual transaction data on Pureframe Labs to find projects that match your budget.`,
    },
  ]
  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {displayFaqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
            <AccordionTrigger className="py-4 text-left text-sm font-medium text-gray-900 hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm text-gray-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <button className="mt-4 flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
        View more <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
