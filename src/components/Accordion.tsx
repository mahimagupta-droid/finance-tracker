import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQs() {
    return (
        <>
            <Accordion
                type="single"
                collapsible
                defaultValue="shipping"
                className="w-11/12 rounded-md text-card-textColor mb-15 mt-15 flex flex-col border border-border bg-card p-5 justify-center font-lato transition-colors duration-300"
            >
                <h2 className="flex flex-col justify-center items-center text-2xl sm:text-3xl font-bold font-lexend p-5 text-center">Frequently Asked Questions</h2>
                <AccordionItem value="shipping">
                    <AccordionTrigger className="hover:text-primary transition text-center"><span className="flex-1 text-center text-lg">What is this platform?</span></AccordionTrigger>
                    <AccordionContent>
                        <div className="text-center text-md">
                            Finsight AI is an AI-powered financial management platform that helps users track expenses, analyze spending patterns, and make smarter financial decisions.
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns">
                    <AccordionTrigger className="hover:text-primary transition text-center"><span className="flex-1 text-center text-lg">Who can use it?</span></AccordionTrigger>
                    <AccordionContent>
                        <div className="text-center text-md">
                            Anyone who wants to manage their finances better — especially students, young professionals, and beginners in personal finance.
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="free">
                    <AccordionTrigger className="hover:text-primary transition text-center"><span className="flex-1 text-center text-lg">Is it free to use?</span></AccordionTrigger>
                    <AccordionContent>
                        <div className="text-center text-md">
                            Yes, it is free to use for users.
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="support">
                    <AccordionTrigger className="hover:text-primary transition text-center"><span className="flex-1 text-center text-lg">Can I set financial goals?</span></AccordionTrigger>
                    <AccordionContent>
                        <div className="text-center text-md">
                            Yes, users can set goals like saving targets, and the platform tracks progress with actionable insights.
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )
}