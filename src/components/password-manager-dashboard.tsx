"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Plus, Pencil, Trash2, Copy, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";
import Confetti from "react-confetti";
import { ModeToggle } from "@/components/mode-toggle";

type Password = {
  id: number;
  website: string;
  username: string;
  password: string;
  category: string;
  lastUpdated: string;
};
export function PasswordManagerDashboard() {
  const [search, setSearch] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [passwords, setPasswords] = useState<Password[]>([
    {
      id: 1,
      website: "example.com",
      username: "user1",
      password: "password123",
      category: "Personal",
      lastUpdated: "2023-05-15",
    },
    {
      id: 2,
      website: "mybank.com",
      username: "johndoe",
      password: "securepass!",
      category: "Finance",
      lastUpdated: "2023-06-01",
    },
    {
      id: 3,
      website: "socialnetwork.com",
      username: "jane_smith",
      password: "p@ssw0rd",
      category: "Social",
      lastUpdated: "2023-05-20",
    },
    {
      id: 4,
      website: "workportal.com",
      username: "jdoe",
      password: "work1234!",
      category: "Work",
      lastUpdated: "2023-07-01",
    },
    {
      id: 5,
      website: "shopping.com",
      username: "shopper1",
      password: "shop2023",
      category: "Personal",
      lastUpdated: "2023-06-15",
    },
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<Password | null>(null);
  const [formData, setFormData] = useState({
    website: "",
    username: "",
    password: "",
    category: "",
  });
  const [formErrors, setFormErrors] = useState({
    website: "",
    username: "",
    password: "",
  });
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { toast } = useToast();
  const [passwordOptions, setPasswordOptions] = useState({
    length: 12,
    useSpecialChars: true,
    useNumbers: true,
    useUppercase: true,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const categories = ["Personal", "Work", "Finance", "Social", "Other"];

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setFormData({ ...formData, password: newPassword });
    setShowFormPassword(true); // Show the password when it's generated
  };

  const generatePassword = (): string => {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (passwordOptions.useUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (passwordOptions.useNumbers) charset += "0123456789";
    if (passwordOptions.useSpecialChars)
      charset += "!@#$%^&*()_+{}[]|:;<>,.?/~`";

    let password = "";
    for (let i = 0; i < passwordOptions.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    return (strength / 5) * 100;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 30) return "bg-red-500";
    if (strength < 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const filteredPasswords = passwords.filter(
    (pw) =>
      (selectedCategories.length === 0 ||
        selectedCategories.includes(pw.category)) &&
      (pw.website.toLowerCase().includes(search.toLowerCase()) ||
        pw.username.toLowerCase().includes(search.toLowerCase())),
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const togglePasswordVisibility = () => setShowPasswords(!showPasswords);

  const openDrawer = (password?: Password) => {
    if (password) {
      setCurrentPassword(password);
      setFormData({
        website: password.website,
        username: password.username,
        password: password.password,
        category: password.category,
      });
    } else {
      setCurrentPassword(null);
      setFormData({ website: "", username: "", password: "", category: "" });
    }
    setFormErrors({ website: "", username: "", password: "" });
    setShowFormPassword(false);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentPassword(null);
    setFormData({ website: "", username: "", password: "", category: "" });
    setShowFormPassword(false); // Reset form password visibility
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { website: "", username: "", password: "" };

    if (!formData.website.trim()) {
      newErrors.website = "Website is required";
      isValid = false;
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const now = new Date().toISOString().split("T")[0];
      if (currentPassword) {
        // Edit existing password
        setPasswords(
          passwords.map((pw) =>
            pw.id === currentPassword.id
              ? { ...pw, ...formData, lastUpdated: now }
              : pw,
          ),
        );
        toast({
          title: "Password Updated",
          description: `Password for ${formData.website} has been updated.`,
        });
      } else {
        // Add new password
        const newPassword = {
          id: Math.max(...passwords.map((pw) => pw.id), 0) + 1,
          ...formData,
          lastUpdated: now,
        };
        setPasswords([...passwords, newPassword]);
        toast({
          title: "Password Added",
          description: `New password for ${formData.website} has been added.`,
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
      }
      closeDrawer();
    }
  };

  const openDeleteDialog = (password: Password) => {
    setCurrentPassword(password);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCurrentPassword(null);
  };

  const handleDelete = () => {
    if (currentPassword) {
      setPasswords(passwords.filter((pw) => pw.id !== currentPassword.id));
      toast({
        title: "Password Deleted",
        description: `Password for ${currentPassword.website} has been deleted.`,
        variant: "destructive",
      });
    }
    closeDeleteDialog();
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      toast({
        title: "Copied to clipboard",
        description: "The password has been copied to your clipboard.",
      });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const calculateSecurityScore = () => {
    let score = 0;
    if (passwords.length > 0) score += 10;
    if (
      passwords.filter((pw) => calculatePasswordStrength(pw.password) >= 60)
        .length > 0
    )
      score += 10;
    return score;
  };

  return (
    <div className="container mx-auto mt-10 p-4 text-black dark:text-white">
      <Toaster />
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Password Manager Dashboard</h1>
        <ModeToggle />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Password Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passwords.length}</div>
            <p className="text-xs text-muted-foreground">Total Passwords</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateSecurityScore()}%
            </div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 days ago</div>
            <p className="text-xs text-muted-foreground">Next check: 5 days</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Password List</CardTitle>
          <CardDescription>Manage your saved passwords</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 mb-4">
            <div className="flex items-center space-x-2">
              <Input
                type="search"
                placeholder="Search passwords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
              <Button onClick={() => openDrawer()}>
                <Plus className="mr-2 h-4 w-4" /> Add Password
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    selectedCategories.includes(category)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto min-h-[200px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Website</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPasswords.map((pw) => (
                  <TableRow key={pw.id}>
                    <TableCell>{pw.website}</TableCell>
                    <TableCell>{pw.username}</TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <span className="w-24 truncate">
                        {showPasswords ? pw.password : "••••••••"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(pw.password, pw.id)}
                      >
                        {copiedId === pw.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{pw.category}</TableCell>
                    <TableCell>
                      <Progress
                        value={calculatePasswordStrength(pw.password)}
                        className={`w-full ${getPasswordStrengthColor(calculatePasswordStrength(pw.password))}`}
                      />
                    </TableCell>
                    <TableCell>{pw.lastUpdated}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openDrawer(pw)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openDeleteDialog(pw)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={togglePasswordVisibility}>
              {showPasswords ? (
                <EyeOff className="mr-2 h-4 w-4" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              {showPasswords ? "Hide Passwords" : "Show Passwords"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use a unique password for each account</li>
            <li>Enable two-factor authentication when available</li>
            <li>Regularly update your passwords</li>
            <li>Avoid using personal information in your passwords</li>
          </ul>
        </CardContent>
      </Card>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="min-w-[350px] bg-white dark:bg-neutral-800 text-black dark:text-white">
          <SheetHeader>
            <SheetTitle>
              {currentPassword ? "Edit Password" : "Add New Password"}
            </SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-6 py-4">
              <div className="space-y-1">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full"
                />
                {formErrors.website && (
                  <p className="text-red-500 text-sm">{formErrors.website}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full"
                />
                {formErrors.username && (
                  <p className="text-red-500 text-sm">{formErrors.username}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="flex space-x-2">
                  <Input
                    id="password"
                    name="password"
                    type={showFormPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGeneratePassword}
                  >
                    Generate
                  </Button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-sm">{formErrors.password}</p>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFormPassword(!showFormPassword)}
                >
                  {showFormPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <span className="text-sm">
                  {showFormPassword ? "Hide" : "Show"} password
                </span>
              </div>
            </div>

            <div className=" col-span-3">
              <Label className="text-sm font-medium">Password Options</Label>
              <div className="mt-2 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useSpecialChars"
                    checked={passwordOptions.useSpecialChars}
                    onCheckedChange={(checked) => {
                      setPasswordOptions((prev) => ({
                        ...prev,
                        useSpecialChars: checked === true,
                      }));
                      if (formData.password) {
                        handleGeneratePassword();
                      }
                    }}
                  />
                  <Label htmlFor="useSpecialChars" className="text-sm">
                    Include special characters
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useNumbers"
                    checked={passwordOptions.useNumbers}
                    onCheckedChange={(checked) => {
                      setPasswordOptions((prev) => ({
                        ...prev,
                        useNumbers: checked === true,
                      }));
                      if (formData.password) {
                        handleGeneratePassword();
                      }
                    }}
                  />
                  <Label htmlFor="useNumbers" className="text-sm">
                    Include numbers
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useUppercase"
                    checked={passwordOptions.useUppercase}
                    onCheckedChange={(checked) => {
                      setPasswordOptions((prev) => ({
                        ...prev,
                        useUppercase: checked === true,
                      }));
                      if (formData.password) {
                        handleGeneratePassword();
                      }
                    }}
                  />
                  <Label htmlFor="useUppercase" className="text-sm">
                    Include uppercase letters
                  </Label>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="length" className="text-sm">
                      Password length: {passwordOptions.length}
                    </Label>
                  </div>
                  <Slider
                    id="length"
                    min={8}
                    max={32}
                    step={1}
                    value={[passwordOptions.length]}
                    onValueChange={(value) => {
                      setPasswordOptions((prev) => ({
                        ...prev,
                        length: value[0],
                      }));
                      if (formData.password) {
                        handleGeneratePassword();
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="w-[400px] sm:w-[540px] bg-white dark:bg-neutral-800 text-black dark:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this password?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              password for {currentPassword?.website}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
