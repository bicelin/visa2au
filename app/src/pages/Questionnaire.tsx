import Layout from '../components/Layout';
import { ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Questionnaire = () => (
  <Layout>
    <section className="relative pt-32 pb-20 t-bg-body overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <ClipboardList className="w-4 h-4 text-visa-gold" />
            <span className="t-text-primary text-sm font-medium">Visa Assessment</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold t-text-primary mb-6">
            Visa <span className="text-gradient-gold">Assessment</span>
          </h1>
          <p className="t-text-muted text-lg">
            Complete this questionnaire for an assessment of your visa options.
          </p>
        </div>
      </div>
    </section>
    <section className="section-padding t-bg-body">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto glass-panel p-8">
          <form className="space-y-5">
            <div className="space-y-2">
              <Label className="t-text-secondary">What is your current location?</Label>
              <Input className="t-bg-input t-border t-text-primary" placeholder="Country" />
            </div>
            <div className="space-y-2">
              <Label className="t-text-secondary">What is your relationship status?</Label>
              <Input className="t-bg-input t-border t-text-primary" placeholder="Single / Married / De facto" />
            </div>
            <div className="space-y-2">
              <Label className="t-text-secondary">Do you have any family in Australia?</Label>
              <Input className="t-bg-input t-border t-text-primary" placeholder="Yes / No" />
            </div>
            <div className="space-y-2">
              <Label className="t-text-secondary">What is your occupation?</Label>
              <Input className="t-bg-input t-border t-text-primary" placeholder="Your occupation" />
            </div>
            <div className="space-y-2">
              <Label className="t-text-secondary">Email Address</Label>
              <Input className="t-bg-input t-border t-text-primary" placeholder="your@email.com" />
            </div>
            <Button className="w-full btn-primary">Get Assessment</Button>
          </form>
        </div>
      </div>
    </section>
  </Layout>
);
export default Questionnaire;
