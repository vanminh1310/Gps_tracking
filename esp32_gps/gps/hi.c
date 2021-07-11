#INCLUDE < 16F877A.H>
#FUSES NOWDT, HS, PUT
#USE DELAY(CLOCK = 4M)
#USE RTOS(TIMER = 1, MINOR_CYCLE = 1MS)
int count,j;
unsigned char mang[] = {0xFE, 0xFC, 0xf8, 0xf0, 0xE0, 0xC0, 0x80, 0x00, 0xff};
#define SH PIN_C0
#define DS PIN_C1
#define ST PIN_C2
void khoitao(void);
void dich_byte(int8 nData);
void ghi_byte(int8 nData);
#task(rate = 100ms, max = 1ms)
void sangdan()
{
    for (j = 0; j < 9; j++)
    {
        ghi_byte(mang[j]);
        RTOS_YIELD();
    }
}
#task(rate = 25ms, max = 1ms)
void RB0()
{
    RTOS_SIGNAL(COUNT);
    IF(COUNT == 20)
    {
        COUNT = 0;
    }
    if (count < 5)
    {
        output_high(PIN_B0);
    }
    else
        output_low(PIN_B0);
}
void main()
{
    khoitao();
    set_tris_b(0); // PORTB as outputs
    output_b(0);
    rtos_run(); // Start RTOS
}

void khoitao(void)
{
    output_low(SH);
    output_low(DS);
    output_low(ST);
}

void dich_byte(int8 nData)
{
    int8 i, nMask;
    nMask = 0x80;
    for (i = 0; i < 8; i++)
    {
        output_low(SH);
        if (nData & nMask)
            output_high(DS); //DS=1
        else
            output_low(DS); // DS=0
        output_high(SH);
        Delay_us(1);
        output_low(SH);
        nMask = nMask >> 1;
    }
}

void ghi_byte(int8 nData)
{
    output_low(ST);
    dich_byte(nData);
    output_high(ST);
}
