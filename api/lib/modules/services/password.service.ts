import PasswordModel  from '../schemas/password.schema';
import bcrypt from 'bcrypt';

class PasswordService {
    public async createOrUpdate(data: any) {
        const result = await PasswordModel.findOneAndUpdate({ userId: data.userId }, { $set: { password: data.password } }, { new: true });
        if (!result) {
            const dataModel = new PasswordModel({ userId: data.userId, password: data.password });
            return await dataModel.save();
        }
        return result;
    }

    public async authorize(userId: string, password: string) {
        try {
            const result = await PasswordModel.findOne({ userId: userId, password: password });
            if (result) {
                return true;
            } else return false;
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }

    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(hashedPassword)
        return hashedPassword;
    }

    public async comparePassword(userId: string, plainPassword: string): Promise<boolean> {
        try {
            const passwordRecord = await PasswordModel.findOne({ userId: userId });
            if (passwordRecord) {
                return await bcrypt.compare(plainPassword, passwordRecord.password);
            }
            return false;
        } catch (error) {
            console.error('Wystąpił błąd podczas porównywania haseł:', error);
            throw new Error('Wystąpił błąd podczas porównywania haseł');
        }
    }

}

export default PasswordService;
