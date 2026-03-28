"use client";

import { Navbar } from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, Lock, Eye, Mail, Info, UserCheck, Smartphone, History } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pb-24 pt-20 bg-background relative overflow-hidden">
      <Navbar />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50 border border-white/10 mb-6 shadow-xl">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-headline text-4xl font-bold uppercase tracking-tight mb-4">Privacy <span className="text-accent">Policy</span></h1>
          <p className="text-muted-foreground uppercase font-bold tracking-widest text-xs">Effective January 21, 2026</p>
        </header>

        <div className="space-y-10 bg-card/30 backdrop-blur-sm border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl">
          
          <section className="space-y-4">
            <p className="text-muted-foreground leading-relaxed text-sm">
              This Privacy Policy governs the manner in which Playmaker LLC (hereinafter “Playmaker”, “We”, “us”, or “our”), collects, use, maintain and disclose information collected from customers of its website playmakers.arena. This Privacy Policy applies to www.playmakers.arena and all products and services offered through www.playmakers.arena.
            </p>
          </section>

          <section className="space-y-8">
            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">01.</span> Playmaker Statement
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Playmaker LLC is committed to protecting and respecting your privacy and maintaining the confidence and trust of its customers. This Privacy Policy explains how your personal information is collected, why it is collected and how it is kept secure.
              </p>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">02.</span> Data Controller
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Playmaker LLC is a company incorporated under the laws of Colorado, with the register number 20261266660 and head office at 807 East Kelly Drive, Loveland, Colorado, 80537. Playmaker LLC is responsible for processing the data collected from you using the website www.playmakers.arena.
              </p>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">03.</span> Type of Information we Collect
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {[
                  { icon: <UserCheck className="h-4 w-4" />, label: "Full Name & DOB" },
                  { icon: <Mail className="h-4 w-4" />, label: "Email & Phone Number" },
                  { icon: <Lock className="h-4 w-4" />, label: "Permanent Address" },
                  { icon: <Smartphone className="h-4 w-4" />, label: "Device & IP Information" },
                  { icon: <Info className="h-4 w-4" />, label: "ID & KYC Documents" },
                  { icon: <History className="h-4 w-4" />, label: "Transaction Data" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/10 border border-white/5 text-muted-foreground">
                    <div className="text-accent">{item.icon}</div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-6">
                <span className="text-accent">14.</span> Notice About Collection
              </h2>
              
              <div className="space-y-8">
                <div className="rounded-xl border border-white/5 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-secondary/20">
                      <TableRow>
                        <TableHead className="text-white uppercase text-[10px] tracking-widest py-4">Personal Info Category</TableHead>
                        <TableHead className="text-white uppercase text-[10px] tracking-widest">Examples</TableHead>
                        <TableHead className="text-white uppercase text-[10px] tracking-widest text-right">Collected</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs text-muted-foreground">
                      {[
                        { cat: "Identifiers", ex: "Real name, alias, postal address, IP address, email", col: "YES" },
                        { cat: "Personal information", ex: "Signature, telephone number, state ID, financial info", col: "YES" },
                        { cat: "Protected classification", ex: "Age (40+), race, citizenship, religion, sex", col: "YES" },
                        { cat: "Biometric information", ex: "Facial recognition data for ID verification", col: "YES" },
                        { cat: "Internet activity", ex: "Browsing history, search history, interaction logs", col: "YES" },
                        { cat: "Geolocation data", ex: "Physical or IP address location", col: "YES" },
                        { cat: "Sensory data", ex: "Audio, electronic, visual information", col: "YES" },
                        { cat: "Professional information", ex: "Current or past job history", col: "YES" },
                        { cat: "Inferences", ex: "Profiles reflecting preferences and behavior", col: "YES" },
                      ].map((row, i) => (
                        <TableRow key={i} className="hover:bg-white/5 border-white/5">
                          <TableCell className="font-bold text-white whitespace-nowrap">{row.cat}</TableCell>
                          <TableCell className="max-w-[300px]">{row.ex}</TableCell>
                          <TableCell className="text-right font-bold text-accent">{row.col}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="rounded-xl border border-white/5 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-destructive/10">
                      <TableRow>
                        <TableHead className="text-white uppercase text-[10px] tracking-widest py-4">Sensitive Info Category</TableHead>
                        <TableHead className="text-white uppercase text-[10px] tracking-widest">Examples</TableHead>
                        <TableHead className="text-white uppercase text-[10px] tracking-widest text-right">Collected</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs text-muted-foreground">
                      {[
                        { cat: "Government identifiers", ex: "Driver’s license or state ID card", col: "YES" },
                        { cat: "Account access credentials", ex: "Customer names, digital currency addresses", col: "YES" },
                        { cat: "Precise geolocation", ex: "Precise physical location or movements", col: "YES" },
                        { cat: "Racial or ethnic origin", ex: "Revealed through identifiers", col: "YES" },
                        { cat: "Religious beliefs", ex: "N/A", col: "NO" },
                        { cat: "Message contents", ex: "Chat conversations on our platform", col: "YES" },
                        { cat: "Unique biometric info", ex: "Identifying biometric data from ID checks", col: "YES" },
                        { cat: "Health/Sex life", ex: "N/A", col: "NO" },
                      ].map((row, i) => (
                        <TableRow key={i} className="hover:bg-white/5 border-white/5">
                          <TableCell className="font-bold text-white whitespace-nowrap">{row.cat}</TableCell>
                          <TableCell className="max-w-[300px]">{row.ex}</TableCell>
                          <TableCell className="text-right font-bold text-accent">{row.col}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div className="p-8 rounded-[2rem] bg-accent/5 border border-accent/20">
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-6 text-accent">
                <Eye className="h-6 w-6" />
                <span className="text-white">15.</span> Your Rights
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>California residents may have specific rights regarding their personal information, including accessing the personal information we’ve collected about you during the past 12 months and information about our data practice.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                    <p className="font-bold text-white mb-1 uppercase text-[10px] tracking-widest">Access & Deletion</p>
                    <p className="text-xs">Request access to or deletion of your personal information via verifiable request.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                    <p className="font-bold text-white mb-1 uppercase text-[10px] tracking-widest">Response Timing</p>
                    <p className="text-xs">We endeavor to provide timely responses to verifiable requests within legal timeframes.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="pt-12 text-center space-y-4">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Questions or Comments?</p>
            <div className="flex flex-col items-center gap-2">
              <a href="mailto:support@playmakers.arena" className="text-accent font-bold hover:underline">support@playmakers.arena</a>
              <p className="text-[10px] text-muted-foreground">Playmaker LLC • 807 E. Kelly Dr., Loveland, USA 80537</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
