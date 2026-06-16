import Layout from '../components/Layout';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const GeneralEnquiry = () => (
  <Layout>
    <section className="relative pt-32 pb-20 t-bg-body overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <FileText className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">General Enquiry</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">
            General <span className="text-gradient-gold">Enquiry</span>
          </h1>
          <p className="t-text-muted text-lg">
            Have a question? Send us a general enquiry and we will get back to you.
          </p>
        </div>
      </div>
    </section>
    <section className="section-padding t-bg-body">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto glass-panel p-8">
          <form className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="t-text-secondary">Full Name</Label>
                <Input className="t-bg-input t-border t-text-primary" placeholder="John Smith" />
              </div>
              <div className="space-y-2">
                <Label className="t-text-secondary">Email</Label>
                <Input className="t-bg-input t-border t-text-primary" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="t-text-secondary">Subject</Label>
              <Input className="t-bg-input t-border t-text-primary" placeholder="Enquiry subject" />
            </div>
            <div className="space-y-2">
              <Label className="t-text-secondary">Message</Label>
              <Textarea className="t-bg-input t-border t-text-primary min-h-[150px]" placeholder="Your enquiry..." />
            </div>
            <Button className="w-full btn-primary">Submit Enquiry</Button>
          </form>
        </div>
      </div>
    </section>
  </Layout>
);
export default GeneralEnquiry;
